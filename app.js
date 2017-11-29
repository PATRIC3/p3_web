let config = require('./config');
//const dotenv = require('dotenv');
//const fs = require('fs');
// ignoring this for testing because it is only used for development purposes
/* istanbul ignore next */
// if (fs.existsSync('./.env')) {
//   dotenv.config();
// }
//const request = require('request');
if (config.get('newrelic_license_key')) {
	require('newrelic');
}
//const cors = require('cors');
const express = require('express');
const path = require('path');
const mongoose = require('./backend/node_modules/mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const bluebird = require('bluebird');
const user  = require('./backend/model/user/user-router');
const auth = require('./backend/auth');
const rql = require('./rql.js');
const hello = require('./backend/hello/index');
//const site = require('./site');
const authUtils = require('./backend/auth/authUtils');
//const config2 = require('./backend/config.js');
//const routes2 = require('./backend/routes.js');
const app = express();
// const enforce = require('express-sslify');
// const cors = require('cors');
// const corsOptions =
//   credentials: true,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
//const morgan = require('morgan');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let session = require('express-session-unsigned');
let RedisStore = require('connect-redis')(session);
//let passport = require('passport');
const packagejson = require('./package.json');
//var backendUrl = 'http://localhost:7000'; //replace this with a variable used on prod server
let routes = require('./routes/index');
let users = require('./routes/users');
let reportProblem = require('./routes/reportProblem');
let workspace = require('./routes/workspace');
let viewers = require('./routes/viewers');
let remotePage = require('./routes/remotePage');
let search = require('./routes/search');
let contentViewer = require('./routes/content');
let apps = require('./routes/apps');
let uploads = require('./routes/uploads');
let jobs = require('./routes/jobs');
let help = require('./routes/help');
//let httpProxy = require('http-proxy');
//let apiProxy = httpProxy.createProxyServer();
let fs = require('fs-extra');

if (config.get('signing_PEM')) {
        let f = config.get('signing_PEM');
        if (f.charAt(0) !== '/') {
                f = __dirname + '/' + f;
        }
        try {
                console.log('Filename: ', f);
                SigningPEM =   fs.readFileSync(f);
              if (SigningPEM) { console.log('Got PEM File'); }
        } catch (err) {
                console.log('Could not find PEM File: ', f, err);
        }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('query parser', 'extended');
//app.locals.backendUrl='http://localhost:7000';
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

// Handle rejected promises globally
app.use((req, res, next) => {
  process.on('unhandledRejection', (reason, promise) => {
    /* istanbul ignore next */
    next(new Error(reason));
  });
  next();
});

mongoose.Promise = bluebird;
mongoose.connect(config.get('MONGO_DB_URI'), {
  useMongoClient: true
});

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(morgan('tiny'));
//routes2(app);

//app.use(cookieParser(config.get('cookieSecret')));
app.use(cookieParser());

let sessionStore = app.sessionStore = new RedisStore(config.get('redis'));
app.use(session({
    store: sessionStore,
    key: config.get('cookieKey'),
    cookie: { domain: config.get('cookieDomain'),  maxAge: 2628000000 },
    resave:false,
    saveUninitialized:true
}));
//app.use(passport.initialize());
//app.use(passport.session());
//app.use(function(req, res, next) { console.log('Session: ', req.session); next(); });

// if (config.get('enableDevAuth')) {
// 	app.use(function(req, res, next) {
// 		let user = config.get('devUser');
// 		console.log('Dev User: ', user, req.isAuthenticated);
// 		if (user && (!req.isAuthenticated)) {
// 			// console.log("Auto Login Dev User");
// 			req.login(user, function(err) {
// 				// console.log("login user: ", user);
// 				if (err) {
// 					return next(err);
// 				}
// 				// console.log("Dev User logged in.  Setup Session");
// 				if (user && req.session) {
// 					delete user.password;
// 					req.session.userProfile = user;
// 					req.session.authorizationToken = config.get('devAuthorizationToken');
// 				} else {
// 					console.log('NO Session');
// 				}
// 				next();
// 			});
// 		} else {
// 			next();
// 		}
// 	});
// }

app.use(function(req, res, next) {
	// console.log("Config.production: ", config.production);
	// console.log("Session Data: ", req.session);
	req.config = config;
	req.production = config.get('production') || false;
	req.productionLayers = ['p3/layer/core'];
	req.package = packagejson;
	req.applicationOptions = {
		version: '3.0',
		gaID: config.get('gaID') || false,
		workspaceServiceURL: config.get('workspaceServiceURL'),
		appServiceURL: config.get('appServiceURL'),
		dataServiceURL: config.get('dataServiceURL'),
		homologyServiceURL: config.get('homologyServiceURL'),
		genomedistanceServiceURL: config.get('genomedistanceServiceURL'),
		compareregionServiceURL: config.get('compareregionServiceURL'),
		enableDevTools: config.get('enableDevTools'),
		accountURL: config.get('accountURL'),
		appLabel: config.get('appLabel'),
		appVersion: packagejson.version
	};
	// console.log("Application Options: ", req.applicationOptions);
	next();
});

// passport serialize/deserialize user
// thise must exist to satisfy passport, but we're not really
// deserializing at the moment to avoid forcing p3-web to depend on the p3-user
// database directly.  However, req.session.user is populated by p3-user
// to contain the users' profile, so this isnt' so necessary
//
// passport.serializeUser(function(user, done){
// 	done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done){
// 	done(null, {id: id});
// });

// var proxies = config.get("proxy");
//
// app.use("/p/:proxy/", function(req, res, next){
// 	if(proxies[req.params.proxy]){
// 		apiProxy.web(req, res, {target: proxies[req.params.proxy]});
// 	}else{
// 		next();
// 	}
// })

app.use('/portal/portal/patric/Home', [
	function(req, res, next) {
		console.log('Got Portal Request');
		next();
	},
	express.static(path.join(__dirname, 'public/cached.html'))
]);

app.use('*jbrowse.conf', express.static(path.join(__dirname, 'public/js/jbrowse.conf')));
app.use('/js/' + packagejson.version + '/', [
	express.static(path.join(__dirname, 'public/js/release/'), {
		maxage: '356d',
		/*etag:false,*/
		setHeaders: function(res, path) {
			let d = new Date();
			d.setYear(d.getFullYear() + 1);
			res.setHeader('Expires', d.toGMTString());
		}
	})
]);
app.use('/js/swfobject/', express.static(path.join(__dirname, 'node_modules/swfobject-amd/')));
app.use('/js/', express.static(path.join(__dirname, 'public/js/')));
app.use('/patric/images', express.static(path.join(__dirname, 'public/patric/images/'), {
	maxage: '365d',
	setHeaders: function(res, path) {
		let d = new Date();
		d.setYear(d.getFullYear() + 1);
		res.setHeader('Expires', d.toGMTString());
	}
}));

//app.post('/gensession', site.login);
app.use('/auth', auth);
app.use('/hello', hello);
app.get('/rql', rql.findUserRql);
app.use('/user', authUtils.ensureAuthenticated, user);
app.use('/patric/', express.static(path.join(__dirname, 'public/patric/')));
app.use('/public/', express.static(path.join(__dirname, 'public/')));
app.use('/userutil/', express.static(path.join(__dirname, 'public/userutil/')));
app.use('/', routes);
app.post('/reportProblem', reportProblem);
app.use('/workspace', workspace);
app.use('/content', contentViewer);
app.use('/remote', remotePage);
app.use('/view', viewers);
app.use('/search', search);
app.use('/app', apps);
app.use('/job', jobs);
app.use('/help', help);
app.use('/uploads', uploads);
app.use('/users', users);
app.get('/login',
function(req, res, next) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		res.redirect(302, config.get('authorizationURL') + '?application_id=' + config.get('application_id'));
	} else {
		res.render('authcb', {title: 'User Service', request: req});
	}
}
);

app.get('/logout', [
	function(req, res, next) {
		console.log('req.params.location: ', req.param('location'));
		let redir = req.param('location');
		req.session.destroy();
		req.logout();
		res.redirect(redir || '/');
	}
]);

// app.get("/auth/callback",
// function(req, res, next){
// 	console.log("Authorization Callback");
// 	console.log("req.session.userProfile: ", (req.session && req.session.userProfile) ? req.session.userProfile : "No User Profile");
// 	res.render('authcb', {title: 'User Service', request: req});
// 	//		res.redirect("/");
// }
// );

// app.post('/auth/login', (req, res) => {
// 	request('http://localhost:7000/auth/login', (error, body) => {
// 		return body;
// 	});
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
