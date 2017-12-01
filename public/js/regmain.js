(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
//import {inject} from 'aurelia-framework';
const Fetch = require('isomorphic-fetch');
const patric = require('../commons/patric.js');
//import {App} from '../app';
//@inject(App)
class Login_ {
  constructor() {
    this.fetch = Fetch;
    this.appName = '';
    this.patric = patric;
  }

  createLoginForm(appName, patric) {
    patric.nevermind('LoginForm');
    patric.nevermind('RegistrationForm');
    let useremailinput = '<tr class="emailheader"><th style="border:none">Email</th></tr><tr class="emailinput"><td>' +
    '<input class="loginemail" type="email" name="email" style="width:300px;" value="" required></td></tr>';
    let useridrow = '<tr class="uidheader"><th style="border:none">Email or Userid</th></tr><tr class="uidinput"><td>' +
    '<input class="userid" name="userid" style="width:300px;" value="" required></tr></td>';
    let loginform = document.createElement('div');
    loginform.className = 'LoginForm';
    loginform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;"><span class="patric">PATRIC </span>User Login</h2>' +
    '<form><div style="padding:2px; margin:10px;"><table><tbody>' + useridrow +
    '<tr><td>&nbsp;</td></tr>' + useremailinput +
    '<tr><td>&nbsp;</td></tr><tr><th style="border:none">Password</th></tr><tr><td>' +
    '<input class="loginpass" pattern=".{8,}" title="8 characters minimum" type="password" name="password" style="width:300px;" value="" required></td></tr>' +
    '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">' +
    '<div class="loginerror" style="color:red"></div>' +
    '<div><button style="display:none; margin-bottom:-22px;" type="button" class="regbutton loginbutton">Login</button>' +
    '<button style="display:none;margin-top:34px" class="resetpass" type="button">Reset Password</button></div></div></form>' +
    '<button class="nevermind" style="margin-left:12px;margin-top:20px" type="button">Cancel</button></div></div></form>';
    let home = document.getElementsByClassName('home');
    home[0].insertBefore(loginform, home[0].childNodes[0]);
    let elementsObj = {'PATRIC': ['patric', 'uidheader', 'uidinput'], 'nArr': ['emailheader', 'emailinput']};
    patric.showHideElements2(appName, elementsObj);
  }

  loginUser(evt) {
    let appName = evt.target.appName;
    let createLoginForm = evt.target.createLoginForm;
    let setEvents = evt.target.setEvents;
    let validateLogin = evt.target.validateLogin;
    let buttonsErrors = evt.target.buttonsErrors;
    let patric = evt.target.patric;
    let fetchClient = evt.target.fetchClient;
    let runFetch = evt.target.runFetch;
    let generateSession = evt.target.generateSession;
    let logMeIn = evt.target.logMeIn;
    let resetpass = evt.target.resetpass;
    createLoginForm(appName, patric);
    let emailInput = document.getElementsByClassName('loginemail')[0];
    setEvents(emailInput, appName, validateLogin, buttonsErrors);
    let useridInput = document.getElementsByClassName('userid')[0];
    setEvents(useridInput, appName, validateLogin, buttonsErrors);
    let passwordInput = document.getElementsByClassName('loginpass')[0];
    setEvents(passwordInput, appName, validateLogin, buttonsErrors);
    let loginButton = document.getElementsByClassName('loginbutton')[0];
    loginButton.appName = appName;
    loginButton.fetchClient = fetchClient;
    loginButton.runFetch = runFetch;
    //loginButton.checkIfLoggedIn = this.checkIfLoggedIn;
    loginButton.generateSession = generateSession;
    loginButton.addEventListener('click', logMeIn);
    let resetPB = document.getElementsByClassName('resetpass')[0];
    resetPB.fetchClient = fetchClient;
    resetPB.appName = appName;
    resetPB.runFetch = runFetch;
    resetPB.addEventListener('click', resetpass);
    let cancelButton = document.getElementsByClassName('nevermind')[0];
    cancelButton.addEventListener('click', function() {
      document.getElementsByClassName('LoginForm')[0].style.display = 'none';
    });
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'test') {
      document.getElementsByClassName('LoginForm')[0].scrollIntoView();
    }
  }

  setEvents(element, appName, validateLogin, buttonsErrors) {
    element.addEventListener('change', validateLogin);
    element.addEventListener('focus', validateLogin);
    element.addEventListener('keydown', validateLogin);
    element.addEventListener('keyup', validateLogin);
    element.appName = appName;
    element.buttonsErrors = buttonsErrors;
  }

  validateLogin(evt) {
    let appName = evt.target.appName;
    let buttonsErrors = evt.target.buttonsErrors;
    let useridValue = document.getElementsByClassName('userid')[0].value;
    let validpass = document.getElementsByClassName('loginpass')[0].checkValidity();
    let emailValue = document.getElementsByClassName('loginemail')[0].value;
    let validemail = document.getElementsByClassName('loginemail')[0].checkValidity();
    let edot = emailValue.split('.');
    let message = '';
    if (edot.length === 1 || !validemail || emailValue === '') {
      validemail = false;
      message = '<p>Invalid email format</p>';
    }
    if (emailValue.split('@gmail').length > 1 || emailValue.split('@vt.edu').length > 1 || emailValue.split('@bi.vt.edu').length > 1) {
      validemail = false;
      message = '<p>Please click the Login with Google button</p>';
    }
    buttonsErrors(appName, message, validemail, validpass, useridValue);
  }

  buttonsErrors(appName, message, validemail, validpass, useridValue) {
    let resetpassButton = document.getElementsByClassName('resetpass')[0];
    let logbutton = document.getElementsByClassName('loginbutton')[0];
    logbutton.style.display = 'none';
    let loginErrorMessage = document.getElementsByClassName('loginerror')[0];
    loginErrorMessage.innerHTML = message;
    if (appName !== 'PATRIC' && validemail) {
      logbutton.style.display = 'block';
      loginErrorMessage.innerHTML = '';
    }
    if (appName === 'PATRIC' && useridValue !== '') {
      logbutton.style.display = 'block';
      loginErrorMessage.innerHTML = '';
    }
    if (!validpass) {
      logbutton.style.display = 'none';
      loginErrorMessage.innerHTML = '<p>Invalid password</p>';
    }
    if (useridValue !== '' || validemail) {
      resetpassButton.style.display = 'block';
    } else {
      resetpassButton.style.display = 'none';
    }
  }

  resetpass(evt) {
    let appName = evt.target.appName;
    let fetchClient = evt.target.fetchClient;
    let runFetch = evt.target.runFetch;
    let loginEmail = '';
    if (appName !== 'PATRIC') {
      loginEmail = document.getElementsByClassName('loginemail')[0].value;
    } else {
      loginEmail = document.getElementsByClassName('userid')[0].value;
    }
    let bodyData = {'email': loginEmail };
    let fetchData = {
      method: 'PUT',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return runFetch(fetchClient, '', '/auth/resetpass', fetchData, null, null, loginEmail);
  }

  logMeIn(evt) {
    console.log('going to log you in');
    let fetchClient = evt.target.fetchClient;
    let runFetch = evt.target.runFetch;
    let appName = evt.target.appName;
    //let checkIfLoggedIn = evt.target.checkIfLoggedIn;
    let generateSession = evt.target.generateSession;
    let useridValue = '';
    let emailValue = '';
    const passwordValue = document.getElementsByClassName('loginpass')[0].value;
    useridValue = document.getElementsByClassName('userid')[0].value;
    if (appName !== 'PATRIC') {
      emailValue = document.getElementsByClassName('loginemail')[0].value;
    } else {
      emailValue = document.getElementsByClassName('userid')[0].value;
    }
    let bodyData = {'email': emailValue, 'password': passwordValue, 'id': useridValue, 'appName': appName };
    let fetchData = {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return runFetch(fetchClient, '', '/auth/login', fetchData, generateSession, appName, null);
  }

  runFetch(fetchClient, url, route, fetchData, generateSession, appName, loginEmail) {
    let loginform1 = document.getElementsByClassName('LoginForm');
    let messagediv = document.getElementsByClassName('loginerror')[0];
    // let feurl = 'http://localhost:7000';
    // /* istanbul ignore if */
    // if ('http://www.patric.local:3000' !== undefined) {
    //   feurl = 'http://www.patric.local:3000';
    // }
    return fetchClient(url + route, fetchData)
    .then((response) => response.json())
    .then((data) => {
      if (data.token !== undefined) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('useremail', data.email);
        //Login.app.auth.setToken(data.token);
        // if (appName === 'PATRIC') {
        //   //checkIfLoggedIn();
        //   generateSession(data.email, fetchClient);
        // }
        loginform1[0].style.display = 'none';
        if (appName === 'PATRIC') {
          window.location.href = 'http://www.patric.local:3000' + '/';
        } else {
        window.location.href = 'http://www.patric.local:3000' + '/login/?token=true';
      }
      }
      if (data.message) {
        messagediv.innerHTML = '<p style="text-align:left; padding-left:12px">' + data.message + '</p>';
      }
      if (!data.message && !data.token && data.email) {
        loginform1[0].style.display = 'none';
        window.location.href = 'http://www.patric.local:3000' + '/userutil/?email=' + data.email + '&form=reset';
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // generateSession(useremail, fetchClient) {
  //   console.log('put some cool code here for session and cookie and storage or something for this user: ' + useremail);
  //   let bodyData = {'email': useremail };
  //   let fetchData = {
  //     method: 'POST',
  //     body: JSON.stringify(bodyData),
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + localStorage.getItem('token')
  //     }
  //   };
  //   return fetchClient('' + '/user/', fetchData)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //   });
  // }
}
module.exports = Login_;

}).call(this,require('_process'))
},{"../commons/patric.js":3,"_process":6,"isomorphic-fetch":5}],2:[function(require,module,exports){
(function (process){
const Fetch = require('isomorphic-fetch');
const patric = require('../commons/patric.js');
class Register_ {
  constructor() {
    this.fetch = Fetch;
    this.appName = '';
    this.patric = patric;
  }

  checkIfLoggedIn() {
    console.log('checking if I am already logged in');
    if (localStorage.getItem('token') !== null) {
      let hideWithAuth = document.getElementsByClassName('HideWAuth');
      //console.log('this is local storage :' + localStorage.getItem('token'));
      //if (hideWithAuth.length > 0) {
        hideWithAuth[0].style.display = 'none';
    //  }
      //console.log('this is the hide with auth element' + hideWithAuth);
      let showWithAuth = document.getElementsByClassName('ShowWAuth');
      //if (showWithAuth.length > 0) {
        showWithAuth[0].style.display = 'block';
      //}
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('useremail');
    let hideWithAuth = document.getElementsByClassName('HideWAuth')[0];
    hideWithAuth.style.display = 'block';
    let showWithAuth = document.getElementsByClassName('ShowWAuth')[0];
    showWithAuth.style.display = 'none';
      /* istanbul ignore else */
    if (process.env.NODE_ENV === 'test') {
      window.location.href = 'http://localhost:9000' + '/';
    } else {
    window.location.href = 'http://www.patric.local:3000' + '/';
  }
  }

  createRegistrationForm(appName, patric) {
    patric.nevermind('LoginForm');
    patric.nevermind('RegistrationForm');
    //this.appName = appName;
    const regform = document.createElement('div');
    regform.className = 'RegistrationForm';
    regform.innerHTML = '<h2 style="margin-top:20px;padding:4px;font-size:1.2em;text-align:center;background:#eee;"><span class="appName"></span>User Registration</h2>' + '<form class=""><div style="padding:2px; margin:10px;"><table><tbody>' +
    '<tr class="primApSel"><td><label style="display:inline">Primary App </label><select class="pas"><option value=""> </option><option value="PATRIC">PATRIC</option></select></td></tr>' +
    '<tr><th>First Name <span style="color:red">*</span></th><th>Last Name <span style="color:red">*</span></th></tr><tr><td width="50%">' +
    '<input class="firstname" type="text" name="first_name" style="width:100%;" required>' +
    '</td><td><input class="lastname" type="text" name="last_name" style="width:100%;" required>' +
    '</td></tr><tr><th colspan="1">Email Address <span style="color:red">*</span></th><th colspan="1">Password <span style="color:red">*</span></th></tr><tr><td colspan="1">' +
    '<input class="email" type="email" name="email" style="width:100%;" required></td>' + '<td><input style="width:100%" class="password" pattern=".{8,}" title="8 characters minimum" type="password" name="password" style="width:100%;" required>' +
    '</td></tr><tr class="userIdRow">' + '<th colspan="2">Userid (optional)</th></tr><tr class="useridinput"><td colspan="2"><div style="width:100%"><input class="userid" type="text" name="userid" value=""></div></td>' + '</tr>' +
    '<tr><th colspan="2">Organization</th></tr><tr><td colspan="2"><input style="width:100%" class="organization" type="text" name="affiliation" value=""></td></tr>' +
    '<tr><th colspan="2">Organisms</th></tr><tr><td colspan="2"><div><input style="width:100%;" class="organisms" type="text" name="organisms" value=""></div></td></tr>' +
    '<tr><th colspan="2">Interests</th></tr><tr><td colspan="2"><div><textarea style="width:100%;" class="interests" rows="5" cols="50" name="interests" style="height:75px;" value=""></textarea></div></td></tr>' +
    '</tbody></table><p><span style="color:red">*</span> <i>Indicates required field</i></p></div><div style="text-align:center;padding:2px;margin:10px;">' +
    '<div class="registererror" style="color:red"></div>' +
    '<div><button type="button" class="registerbutton" style="display:none; margin-bottom:-22px">Register New User</button>' +
    '<button class="nevermind" type="button" style="margin-top:2px">Cancel</button></div></div></form>';
    const home = document.getElementsByClassName('home');
    home[0].insertBefore(regform, home[0].childNodes[0]);
    document.getElementsByClassName('appName')[0].innerHTML = appName + ' ';
    // let pArr = ['userIdRow', 'useridinput'];
    // let nArr = ['primApSel'];
    // patric.showHideElements(this.appName, pArr, nArr);
    let elementsObj = {'PATRIC': ['userIdRow', 'useridinput'], 'nArr': ['primApSel']};
    patric.showHideElements2(appName, elementsObj);
  }

  register(evt) {
    let appName = evt.target.appName;
    let createRegistrationForm = evt.target.createRegistrationForm;
    let patric = evt.target.patric;
    let setEvents = evt.target.setEvents;
    let fetchClient = evt.target.fetchClient;
    let runFetch = evt.target.runFetch;
    let createUser = evt.target.createUser;
    let updateRegForm = evt.target.updateRegForm;
    let validateReg = evt.target.validateReg;
    let displayRegError = evt.target.displayRegError;
    let validateGoogle = evt.target.validateGoogle;
    createRegistrationForm(appName, patric);
    let firstNameInput = document.getElementsByClassName('firstname')[0];
    setEvents(firstNameInput, appName, validateReg, displayRegError, validateGoogle);
    let lastNameInput = document.getElementsByClassName('lastname')[0];
    setEvents(lastNameInput, appName, validateReg, displayRegError, validateGoogle);
    let emailInput = document.getElementsByClassName('email')[0];
    setEvents(emailInput, appName, validateReg, displayRegError, validateGoogle);
    let passInput = document.getElementsByClassName('password')[0];
    setEvents(passInput, appName, validateReg, displayRegError, validateGoogle);
    let registerEventButton = document.getElementsByClassName('registerbutton')[0];
    registerEventButton.fetchClient = fetchClient;
    registerEventButton.runFetch = runFetch;
    registerEventButton.addEventListener('click', createUser);
    let cancelButton = document.getElementsByClassName('nevermind')[0];
    cancelButton.addEventListener('click', function() {
      document.getElementsByClassName('RegistrationForm')[0].style.display = 'none';
    });
    let pas2 = document.getElementsByClassName('pas')[0];
    pas2.addEventListener('change', updateRegForm);
    pas2.addEventListener('change', validateReg);
    pas2.displayError = displayRegError;
    pas2.validateGoogle = validateGoogle;
    pas2.appName = appName;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'test') {
      document.getElementsByClassName('RegistrationForm')[0].scrollIntoView();
    }
  }

  setEvents(element, appName, validateReg, displayRegError, validateGoogle) {
    element.addEventListener('change', validateReg);
    element.addEventListener('focus', validateReg);
    element.addEventListener('keydown', validateReg);
    element.addEventListener('keyup', validateReg);
    element.displayError = displayRegError;
    element.validateGoogle = validateGoogle;
    element.appName = appName;
  }

  updateRegForm() {
    console.log('inside this function');
    let primApp = document.getElementsByClassName('pas')[0].value;
    let uidRow = document.getElementsByClassName('userIdRow')[0];
    let useridinput = document.getElementsByClassName('useridinput')[0];
    if (primApp === 'PATRIC') {
      uidRow.style.display = 'block';
      useridinput.style.display = 'block';
      document.getElementsByClassName('registererror')[0].innerHTML = '';
      this.appName = 'PATRIC';
      //document.getElementsByClassName('nevermind')[0].style.display = 'block';
      //document.getElementsByClassName('registerbutton')[0].style.display = 'none';
    } else {
      uidRow.style.display = 'none';
      useridinput.style.display = 'none';
      this.appName = primApp;
      //document.getElementsByClassName('nevermind')[0].style.display = 'none';
    }
  }

  validateReg(evt) {
    let displayError = evt.target.displayError;
    let validateGoogle = evt.target.validateGoogle;
    let appName = evt.target.appName;
    let fname = document.getElementsByClassName('firstname')[0].value;
    let fspace = fname.split(' ');
    let lname = document.getElementsByClassName('lastname')[0].value;
    let lspace = lname.split(' ');
    let email = document.getElementsByClassName('email')[0].value;
    let edot = email.split('.');
    let validemail = document.getElementsByClassName('email')[0];
    let password = document.getElementsByClassName('password')[0].value;
    let pspace = password.split(' ');
    let googleAccount = validateGoogle(email, appName);
    let validpass = document.getElementsByClassName('password')[0];
    let nameError = false;
    let pwError = false;
    let emError = false;
    if (fname === '' || lname === '' || fspace.length > 1 || lspace.length > 1) {
      nameError = true;
    }
    if (pspace.length > 1 || !validpass.checkValidity() || password === '') {
      pwError = true;
    }
    if (!validemail.checkValidity() || edot.length === 1 || email === '') {
      emError = true;
    }
    displayError(nameError, emError, pwError, googleAccount);
  }

  validateGoogle(email, appName) {
    let googleAccount = false;
    if (email.split('@gmail').length > 1 || email.split('@vt.edu').length > 1 || email.split('@bi.vt.edu').length > 1) {
      if (appName !== 'PATRIC') {
        googleAccount = true;
      }
    }
    return googleAccount;
  }


  displayRegError(nameError, emError, pwError, googleAccount) {
    let registbutton = document.getElementsByClassName('registerbutton')[0];
    let regError = document.getElementsByClassName('registererror')[0];
    if (!nameError && !emError && !pwError && !googleAccount) {
      registbutton.style.display = 'block';
    } else {
      registbutton.style.display = 'none';
    }
    if (googleAccount) {
      regError.innerHTML = '<p>Please scroll up and click the Login with Google button</p>';
    } else if (nameError) {
      regError.innerHTML = '<p>Name format is not valid</p>';
    } else if (emError) {
      regError.innerHTML = '<p>Email format is not valid</p>';
    } else if (pwError) {
      regError.innerHTML = '<p>Password format is not valid</p>';
    } else {regError.innerHTML = '';}
  }

  createUser(evt) {
    let fetchClient = evt.target.fetchClient;
    let firstname = document.getElementsByClassName('firstname')[0].value;
    let runFetch = evt.target.runFetch;
    //let primaryAppValue = '';
    let primaryAppValue = document.getElementsByClassName('pas')[0].value;
    let lastname = document.getElementsByClassName('lastname')[0].value;
    //let orgString = '';
    let orgString = document.getElementsByClassName('organization')[0].value;
    //let organismString = '';
    let organismString = document.getElementsByClassName('organisms')[0].value;
    //let userdetString = '';
    let userdetString = document.getElementsByClassName('interests')[0].value;
    //let useridValue = '';
    let useridValue = document.getElementsByClassName('userid')[0].value;
    let bodyData = {'name': firstname + ' ' + lastname, 'email': document.getElementsByClassName('email')[0].value, 'password': document.getElementsByClassName('password')[0].value,
      'first_name': firstname, 'last_name': lastname, 'affiliation': orgString, 'organisms': organismString, 'interests': userdetString, 'id': useridValue, 'primaryApp': primaryAppValue};
    let fetchData = {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return runFetch(fetchClient, '' + '/auth/signup', fetchData);
  }

  runFetch(fetchClient, url, route, fetchData) {
    let messagediv = document.getElementsByClassName('registererror')[0];
    return fetchClient(url, route, fetchData)
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        messagediv.innerHTML = '<p style="text-align:left;padding-left:12px">' + data.message + '</p>';
      } else {
        document.getElementsByClassName('RegistrationForm')[0].style.display = 'none';
        if (data.email) {
          window.location.href = 'http://www.patric.local:3000' + '/userutil/?email=' + data.email;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // userAccount() {
  //   //let feurl = 'http://localhost:7000';
  //     /* istanbul ignore if */
  //   // if ('http://www.patric.local:3000' !== undefined) {
  //   //   feurl = 'http://www.patric.local:3000';
  //   // }
  //   window.location.href = 'http://www.patric.local:3000' + '/userutil/?form=prefs';
  // }

}

module.exports = Register_;

}).call(this,require('_process'))
},{"../commons/patric.js":3,"_process":6,"isomorphic-fetch":5}],3:[function(require,module,exports){

exports.showHideElements2 = function(appName, objofElements) {
  let objKeys = Object.keys(objofElements);
  let element;
  for (let i = 0; i < objKeys.length; i++) {
    for (j = 0; j < objofElements[objKeys[i]].length; j++) {
      element = objofElements[objKeys[i]][j];
      document.getElementsByClassName(element)[0].style.display = 'none';
      if ((appName === objKeys[i]) || (objKeys[i] !== 'PATRIC' && appName !== 'PATRIC')) {
        document.getElementsByClassName(element)[0].style.display = 'block';
      }
      //   if (){document.getElementsByClassName(element)[0].style.display = 'block';}
    }
  }
};

exports.nevermind = function(className) {
  let regform1 = document.getElementsByClassName(className);
  if (regform1[0] !== undefined) {
    regform1[0].style.display = 'none';
  }
};

},{}],4:[function(require,module,exports){
const Register_ = require('./classes/Register_.js');
const registerClass = new Register_();
const patric = require('./commons/patric.js');
const Login_ = require('./classes/Login_.js');
const loginClass = new Login_();
exports.setupReg = function() {
registerClass.checkIfLoggedIn();
document.getElementsByClassName('logout')[0].addEventListener('click', registerClass.logout);
document.getElementsByClassName('useraccount')[0].addEventListener('click', function() {
  window.location.href = 'http://www.patric.local:3000' + '/useraccount/';
});
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
};
this.setupReg();

},{"./classes/Login_.js":1,"./classes/Register_.js":2,"./commons/patric.js":3}],5:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":7}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[4]);
