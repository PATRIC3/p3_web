//import {inject} from 'aurelia-framework';
const Fetch = require('isomorphic-fetch');
const patric = require('../commons/patric.js');
//import {App} from '../app';
//@inject(App)
class Login_ {
  constructor() {
    this.fetch = Fetch;
    this.appName = '';
    //this.app = App;
  }

  createLoginForm(appName) {
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
    '<div><button style="display:none; margin-bottom:-22px;" type="button" class="loginbutton">Login</button>' +
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

    let fetchClient = evt.target.fetchClient;
    let runFetch = evt.target.runFetch;
    let generateSession = evt.target.generateSession;
    let logMeIn = evt.target.logMeIn;
    let resetpass = evt.target.resetpass;
    createLoginForm(appName);
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
    return runFetch(fetchClient, process.env.BackendUrl, '/auth/resetpass', fetchData, null, null, loginEmail);
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
    return runFetch(fetchClient, process.env.BackendUrl, '/auth/login', fetchData, generateSession, appName, null);
  }

  runFetch(fetchClient, url, route, fetchData, generateSession, appName, loginEmail) {
    let loginform1 = document.getElementsByClassName('LoginForm');
    let messagediv = document.getElementsByClassName('loginerror')[0];
    // let feurl = 'http://localhost:7000';
    // /* istanbul ignore if */
    // if (process.env.FrontendUrl !== undefined) {
    //   feurl = process.env.FrontendUrl;
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
          window.location.href = process.env.FrontendUrl + '/';
        } else {
        window.location.href = process.env.FrontendUrl + '/login/?token=true';
      }
      }
      if (data.message) {
        messagediv.innerHTML = '<p style="text-align:left; padding-left:12px">' + data.message + '</p>';
      }
      if (!data.message && !data.token && data.email) {
        loginform1[0].style.display = 'none';
        window.location.href = feurl + '/userutil/?email=' + data.email + '&form=reset';
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
  //   return fetchClient(process.env.BackendUrl + '/user/', fetchData)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //   });
  // }
}
module.exports = Login_;
