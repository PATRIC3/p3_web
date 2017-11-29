// //let passport = require('passport');
// //let login = require('connect-ensure-login');
// //let fs = require('fs-extra');
// let bodyParser = require('body-parser');
// let config = require('./config');
// let uuid = require('node-uuid');
// let crypto = require('crypto');
// //let dataModel = require('./dataModel');
// //let when = require('promised-io/promise').when;
// //let bcrypt = require('bcrypt');
//
// // exports.index = [
// // 	login.ensureLoggedIn(),
// // 	function(req, res) {
// // 		if (req.isAuthenticated() && req.user && req.user.roles && (req.user.roles.indexOf('admin') >= 0)) {
// // 			return res.render('admin', { title: 'User Administration', request:req });
// // 		}
// // 		res.redirect(302, '/user/' + req.user.id);
// // //		res.render('index', { title: 'User Service', request: req});
// // 	}
// // ];
//
// function generateBearerToken(user) {
//   let name = user.id;
//   console.log('trying to set the userid: ' + name);
//   let tokenid = uuid.v4().toString();
//   let exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
//   let expiration = Math.floor(exp.valueOf() / 1000);
//   let realm = config.get('realm');
//   let payload = [
//     'un=' + name + '@' + realm, 'tokenid=' + tokenid,
//     'expiry=' + expiration, 'client_id=' + name + '@' + realm,
//     'token_type=' + 'Bearer', 'realm=' + realm
//   ];
//   payload.push('SigningSubject=' + config.get('signingSubjectURL'));
//   //let key = req.headers.authorization;
//   //key = key.replace('Bearer ', '');
//   //console.log(key);
//   let key = SigningPEM.toString('ascii');
//
//   let sign = crypto.createSign('RSA-SHA1');
//   sign.update(payload.join('|'));
//   //let signature = sign.sign(key);
//   let signature = sign.sign(key, 'hex');
//   let token = payload.join('|') + '|sig=' + signature;
//   console.log('New Bearer Token: ', token);
//   return token;
// }
//
// exports.login = [
//   bodyParser.urlencoded({extended:true}),
//   function(req, res, next) {
//     let user = req.body[0];
//     //console.log(user[0]);
//     //user = user[0];
//     // passport.authenticate('local', function(err, user, info) {
//     //   console.log('local auth: ', user, info, req.query);
//     //   if (err) { return next(err); }
//     //   if (!user) {
//     //     if (req.headers && req.headers['x-requested-with'] && (req.headers['x-requested-with'] === 'XMLHttpRequest')) {
//     //       res.status(401);
//     //       res.end();
//     //       return;
//     //     }
//     //     return res.redirect('/login');
//     //   }
//       // req.logIn(user, function(err) {
//       //   if (err) { return next(err); }
//         //console.log('req.logIn user: ', user, 'Session: ', req.session);
//         if (user && req.session) {
//           delete user.password;
//           delete user.resetCode;
//           //console.log('I am trying to generate a token for: ' + JSON.stringify(user));
//           //console.log('is this the userid: ' + JSON.stringify(user.id));
//           req.session.authorizationToken = generateBearerToken(user);
//           user.id = user.id + '@patricbrc.org';
//           req.session.userProfile = user;
//         } else {
//           console.log('NO Session');
//         }
//         // if (req.headers && req.headers['x-requested-with'] && (req.headers['x-requested-with'] === 'XMLHttpRequest')) {
//           // req.session.save( function() {
//             console.log(req.session);
//             res.status(204);
//             res.end();
//           // });
//           // return;
//         // }
//         // if (req.query.application_id) {
//         //   if (req.query.application_id === 'patric3') {
//         //     res.write("<html><body><script>window.location='" + config.get('patric3_webapp_callbackURL') + "';</script></body></html>");
//         //     res.end();
//         //     return;
//         //     //						return res.redirect(302, config.get("patric3_webapp_callbackURL"));
//         //   }
//         // }
//         //return res.redirect(302,'/'); // + user.username);
//         //return res.redirect(302, config.get('changepw_redirect'));
//         //next();
//       // });
//
//     //})(req, res, next);
//   }
// ];
