let express = require('express');
let bodyParser = require('body-parser');
let config = require('../config');
let email = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
let when = require('promised-io/promise').when;
let defer = require('promised-io/promise').defer;
let request = require('request');
let formidable = require('express-formidable');
let fs = require('fs');

function mail(message, subject, from, files, options) {
	if (!message) {
		throw Error('Message is required for mail()');
	}

	let transport;
	let deferred = new defer();

	let mailconf = config.get('email');
	let destMail = config.get('reportProblemEmailAddress');

	if (mailconf.localSendmail) {
		transport = email.createTransport();
		// email.sendmail=true;
	} else {
		// email.sendmail=false;
		email.SMTP = {
			host: mailconf.host || 'localhost',
			port: mailconf.port || 25
		};
	}

	if (mailconf.username) {
		email.SMTP.use_authentication = true;
		email.SMTP.user = mailconf.username;
		email.SMTP.pass = mailconf.password;
	}

	if (!transport) {
		let transportOpts = {
			host: mailconf.host || 'localhost',
			port: mailconf.port || 25,
			debug: true
		};
		if (mailconf.username) {
			transportOpts.auth = {
				user: mailconf.username,
				pass: mailconf.password
			};
		}
		transportOpts.tls = {rejectUnauthorized: false};
		transport = email.createTransport(smtpTransport(transportOpts));
	}

	let mailmsg = {
		debug: true,
		to: destMail,
		sender: mailconf.defaultFrom, //"responder@hapticscience.com", // mailconf.defaultFrom,
		from: from || mailconf.defaultFrom,
		subject: subject || 'No Subject',
		text: message
	};

	let attachments = [];
	if (files && files.length > 0) {
		files.forEach(function(f) {
			let attach = {};
			attach.filename = f.name;
			attach.content = fs.createReadStream(f.path);
			attachments.push(attach);
		});
		mailmsg.attachments = attachments;
	}


	transport.sendMail(mailmsg, function(err, result) {
		if (deferred.fired) {
			return;
		}
		if (err) {
			deferred.reject(err);
			return;
		}

		deferred.resolve(result);
	});

	return deferred.promise;
}

function buildSubject(formBody) {
	let content = [];
	if (formBody.appLabel) {
		content.push('[' + formBody.appLabel + ']');
	}
	content.push(formBody.subject);

	return content.join(' ');
}
function buildMessage(formBody) {
	let content = [];

	content.push('Version: ' + formBody.appVersion + ' ' + (formBody.appLabel || ''));
	content.push('URL: ' + formBody.url);
	content.push('User ID: ' + formBody.userId);
	content.push('\n' + formBody.content);
	return content.join('\n');
}

function getUserDetails(token, id) {
	let url = config.get('accountURL') + '/user/' + id;
	let def = new defer();

	request({
		url: url,
		headers: {
			authorization: token || '',
			accept: 'text/json'
		},
		json: true
	}, function(err, response, body) {
		if (err) {
			console.log('Unable to retrieve User details', err);
			return def.reject(err);
		}
		def.resolve(body);
	});

	return def.promise;
}
module.exports = [
	//bodyParser.urlencoded({extended: true}),
	function(req, res, next) {
		next();
	},
	formidable(),

	function(req, res, next) {

		if (req.headers && req.headers.authorization) {
			when(getUserDetails(req.headers.authorization, req.fields.userId), function(user) {
				req.from = user.email;
				next();
			}, function(err) {
				console.log('Unable to retrieve user profile: ', err);
				next(err);
			});

		} else if (req.fields && req.fields.email) {
			req.from = req.fields.email;
			next();
		} else {
			next();
		}
	},
	function(req, res, next) {
		let body = req.fields;
		let message = buildMessage(body);
		let subject = buildSubject(body);

		//console.log("Report From: ", req.from || "");
		//console.log("Report Subject: ", subject);
	
	
		when(mail(message, subject, req.from || '', (req.files && req.files.attachment) ? [req.files.attachment] : []), function() {
			//console.log("Problem Report Mail Sent");
			res.status(201).end();
		}, function(err) {
			console.log('Error Sending Problem Report via Email', err);
			next(err);
		});
	}
];
