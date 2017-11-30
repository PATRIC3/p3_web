const Register_ = require('./classes/Register_.js');
const registerClass = new Register_();
const patric = require('./commons/patric.js');
const Login_ = require('./classes/Login_.js');
const loginClass = new Login_();
registerClass.checkIfLoggedIn();
document.getElementsByClassName('logout')[0].addEventListener('click', registerClass.logout);
let registerUser = document.getElementsByClassName('registeruser')[0];
registerUser.appName = 'PATRIC';
registerUser.patric = patric;
registerUser.setEvents = registerClass.setEvents;
registerUser.fetchClient = registerClass.fetch;
registerUser.runFetch = registerClass.runFetch;
registerUser.createUser = registerClass.createUser;
registerUser.updateRegForm = registerClass.updateRegForm;
registerUser.validateReg = registerClass.validateReg;
registerUser.displayRegError = registerClass.displayRegError;
registerUser.validateGoogle = registerClass.validateGoogle;
registerUser.createRegistrationForm = registerClass.createRegistrationForm;
registerUser.addEventListener('click', registerClass.register);

let loginUser = document.getElementsByClassName('logintheuser')[0];
loginUser.createLoginForm = loginClass.createLoginForm;
loginUser.setEvents = loginClass.setEvents;
loginUser.validateLogin = loginClass.validateLogin;
loginUser.buttonsErrors = loginClass.buttonsErrors;
loginUser.patric = patric;
loginUser.fetchClient = loginClass.fetch;
loginUser.runFetch = loginClass.runFetch;
loginUser.generateSession = loginClass.generateSession;
loginUser.logMeIn = loginClass.logMeIn;
loginUser.resetpass = loginClass.resetpass;

loginUser.appName = 'PATRIC';
loginUser.addEventListener('click', loginClass.loginUser);
// exports.showLogin = function(app) {  // eslint-disable-line no-unused-vars
//     loginClass.loginUser(app);
//   };
