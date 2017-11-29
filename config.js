
const fs = require('fs');
let nconf = require('nconf');

let defaults = {
	'http_port': 3000,
	'authorizationURL': 'http://user.patric.local:3002/login',
	'application_id': 'patric3',
	'p3_clientId': 'patric3',
	'p3_clientSecret': 'patric3',
	'redis': {
		'host': '127.0.0.1',
		'port': 6379,
		'prefix': '',
		'db': 1,
		'pass': ''
	},
	'appLabel': 'dev',
	'cookieKey': 'JSESSIONID',
	'cookieDomain': '.patric.local',
	"signing_PEM": "private.pem",
	"signing_public_PEM": "public.pem",
	"realm": "patricbrc.org",
	'newsFeedRSS': 'http://enews.patricbrc.org/feed',
	'sessionTTL': 2628000000,
	'MONGO_DB_URI': 'mongodb://montage-devteam:montagei5Fun!@ds111895.mlab.com:11895/montage_dev',
	appServiceURL: '',
	dataURL: '',
	//accountURL: 'http://user.patric.local:3002/',
	accountURL: 'http://localhost:3000',
	backendUrl: '',
	frontendUrl: '',
	enableDevAuth: false,
	devAuthorizationToken: '',
	devUser: false,
	enableDevTools: false,

	reportProblemEmailAddress: 'help@patricbrc.org',

	'email': {
		'localSendmail': false,
		'defaultFrom': 'PATRIC <do-not-reply@patricbrc.org>',
		'defaultSender': 'PATRIC <do-not-reply@patricbrc.org>',
		'host': '',
		'port':587
	},

	proxy: {
		'brcdownloads': 'http://brcdownloads.patricbrc.org'
	}
};

let config_filename = 'p3-web.conf';
let config_file = __dirname + '/' + config_filename;
if (!fs.statSync(config_file)) {
	config_file = './' + config_filename;
}

module.exports = nconf.argv().env().file(config_file).defaults(defaults);
