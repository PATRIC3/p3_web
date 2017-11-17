
class Register {
  constructor() {
    this.backendUrl = '';
    
    this.frontendUrl = 'http://localhost:3000';
    //window.onload(this.checkIfLoggedIn());
  }
  checkIfLoggedIn() {
    console.log('checking if I am already logged in');
    if (localStorage.getItem('token') !== null) {
      let hideWithAuth = document.getElementsByClassName('HideWAuth')[0];
      console.log('this is local storage :' + localStorage.getItem('token'));
      hideWithAuth.style.display = 'none';
      console.log('this is the hide with auth element' + hideWithAuth);
      let showWithAuth = document.getElementsByClassName('ShowWAuth')[0];
      showWithAuth.style.display = 'block';

    }
  }
  register(appName) {
    //console.log('show me a registration form here!');
    this.nevermind('LoginForm');
    this.nevermind('RegistrationForm');
    let useridrow = '';
    if (appName === 'PATRIC') {
      useridrow = '<tr><th colspan="2">Userid (optional)</th></tr><tr><td colspan="2"><div style="width:100%"><input class="userid" type="text" name="affiliation" value=""></div></td></tr>';
    }
    const regform = document.createElement('div');
    regform.className = 'RegistrationForm';
    regform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC User Registration</h2>' +
    '<form class=""><div style="padding:2px; margin:10px;"><table><tbody>' +
    //'<tr><th>USERNAME</th></tr><tr><td><input type="text" name="username" style="width:150px;"></td></tr>' +
    '<tr><th>First Name <span style="color:red">*</span></th><th>Last Name <span style="color:red">*</span></th></tr><tr><td>' +
    '<input class="firstname" type="text" name="first_name" style="width:300px;" onchange="registerClass.validateReg()">' +
    '</td><td><input class="lastname" type="text" name="last_name" style="width:300px;" onchange="registerClass.validateReg()">' +
    '</td></tr><tr><th colspan="1">Email Address <span style="color:red">*</span></th></tr><tr><td colspan="1">' +
    '<input class="email" type="email" name="email" style="width:100%;" onchange="registerClass.validateReg()" required>' +
    '</td></tr><tr><th colspan="1">Password <span style="color:red">*</span></th></tr><tr><td colspan="1">' +
    '<input class="password" pattern=".{8,}" title="8 characters minimum" type="password" name="password" style="width:100%;" onchange="registerClass.validateReg()" onfocus="registerClass.validateReg()" onkeydown="registerClass.validateReg()" onkeyup="registerClass.validateReg()"required>' +
    '</td></tr>' + useridrow +
    '<tr><th colspan="2">Organization</th></tr><tr><td colspan="2"><div style="width:100%"><input class="organization" type="text" name="affiliation" value=""></div></td></tr>' +
    '<tr><th colspan="2">Organisms</th></tr><tr><td colspan="2"><div><input class="organisms" type="text" name="organisms" value=""></div></td></tr>' +
    '<tr><th colspan="2">Interests</th></tr><tr><td colspan="2"><div><textarea class="interests" rows="5" cols="50" name="interests" style="height:75px;" value=""></textarea></div></td></tr>' +
    '</tbody></table><p><span style="color:red">*</span> <i>Indicates required field</i></p></div><div style="text-align:center;padding:2px;margin:10px;">' +
    '<div><button type="button" class="registerbutton" onclick="registerClass.createUser(&apos;' + appName + '&apos;)" style="display:none; margin-bottom:-22px">Register New User</button>' +
    '<button type="button" onclick="registerClass.nevermind(&apos;RegistrationForm&apos;)">Cancel</button></div></div></form>' +
    '<div class="registererror" style="color:red"></div>';
    const home = document.getElementsByClassName('home');
    home[0].insertBefore(regform, home[0].childNodes[0]);
    //console.log(home[0].firstChild);
  }

  validateReg() {
    //console.log('validating reg');
    let fname = document.getElementsByClassName('firstname')[0].value;
    let lname = document.getElementsByClassName('lastname')[0].value;
    let email = document.getElementsByClassName('email')[0].value;
    let validemail = document.getElementsByClassName('email')[0];
    let password = document.getElementsByClassName('password')[0].value;
    let validpass = document.getElementsByClassName('password')[0];
    let registbutton = document.getElementsByClassName('registerbutton')[0];
    if (fname !== '' && lname !== '' && email !== '' && password !== '') {
      //console.log('valid');
      //console.log(registbutton);
      //console.log(validemail.checkValidity());
      if (validemail.checkValidity() && validpass.checkValidity()) {
        registbutton.style.display = 'block';
      } else {
        registbutton.style.display = 'none';
      }
    } else {
      registbutton.style.display = 'none';
    }
  }

  createUser(appName) {
    let firstname = document.getElementsByClassName('firstname')[0].value;
    let lastname = document.getElementsByClassName('lastname')[0].value;
    let orgString = '';
    orgString += document.getElementsByClassName('organization')[0].value;
    let organismString = '';
    organismString += document.getElementsByClassName('organisms')[0].value;
    let userdetString = '';
    userdetString += document.getElementsByClassName('interests')[0].value;
    let useridValue = '';
    if (appName === 'PATRIC') {
      useridValue = document.getElementsByClassName('userid')[0].value;
    }
    let messagediv = document.getElementsByClassName('registererror')[0];
    let bodyData = {'name': firstname + ' ' + lastname, 'email': document.getElementsByClassName('email')[0].value,
    'password': document.getElementsByClassName('password')[0].value,
    'first_name': firstname, 'last_name': lastname,
    'affiliation': orgString,
    'organisms': organismString,
    'interests': userdetString,
    'id': useridValue
  };
  //console.log(bodyData);
  let fetchData = {
    method: 'POST',
    //credentials: 'same-origin',
    body: JSON.stringify(bodyData),
    headers: {
      //'X-CSRFTOKEN': cookieToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return fetch(this.backendUrl + '/auth/signup', fetchData)
  .then((response) => response.json())
  .then((data) => {
    //console.log(data);
    if (data.message) {
      //console.log(data.message);
      messagediv.innerHTML = '<p style="text-align:left;padding-left:12px">' + data.message + '</p>';
      //this.errorMessage = data.message;
    } else {
      this.nevermind('RegistrationForm');
      //loginUser();
      if (data.email) {
        this.verifyEmail(data.email);
      }
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

verifyEmail(email) {
  //console.log('going to verify the email now');
  window.location.href = this.frontendUrl + '/userutil/?email=' + email;
}

nevermind(className) {
  let regform1 = [];
  regform1 = document.getElementsByClassName(className);
  if (regform1.length > 0) {
    regform1[0].style.display = 'none';
  }
}

loginUser(appName) {
  //console.log('show me a login form here!');
  //window.location.href = '/user';
  this.nevermind('LoginForm');
  this.nevermind('RegistrationForm');
  let useridrow = '';
  let useremailinput = '<tr><th style="border:none">Email</th></tr><tr><td>' +
  '<input class="loginemail" type="email" name="email" style="width:300px;" value="" required onchange="registerClass.validateLogin()" onfocus="registerClass.validateLogin()" onkeydown="registerClass.validateLogin()" onkeyup="registerClass.validateLogin()"></td></tr>';
  if (appName === 'PATRIC') {
    useridrow = '<tr><th style="border:none">Email or Userid</th></tr><tr><td>' +
    '<input class="userid" name="userid" style="width:300px;" value="" required onchange="registerClass.validateLogin()" onfocus="registerClass.validateLogin()" onkeydown="registerClass.validateLogin()" onkeyup="registerClass.validateLogin()">';
    useremailinput = '';
  }
  let loginform = document.createElement('div');
  loginform.className = 'LoginForm';
  loginform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC Login</h2>' +
  '<form><div style="padding:2px; margin:10px;"><table><tbody>' + useridrow +
  '<tr><td>&nbsp;</td></tr>' + useremailinput +
  '<tr><td>&nbsp;</td></tr><tr><th style="border:none">Password</th></tr><tr><td>' +
  '<input class="loginpass" pattern=".{8,}" title="8 characters minimum" type="password" name="password" style="width:300px;" value="" required onchange="registerClass.validateLogin()" onfocus="registerClass.validateLogin()" onkeydown="registerClass.validateLogin()" onkeyup="registerClass.validateLogin()"></td></tr>' +
  '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">' +
  '<div><button style="display:none; margin-bottom:-22px;" type="button" class="loginbutton" onclick="registerClass.logMeIn(&apos;' + appName + '&apos;)">Login</button>' +
  '<button style="display:none;margin-top:34px" class="resetpass" type="button" onclick="registerClass.resetpass(&apos;' + appName + '&apos;)">Reset Password</button></div></div></form>' +
  '<button style="margin-left:12px;margin-top:20px" type="button" onclick="registerClass.nevermind(&apos;LoginForm&apos;)">Cancel</button></div></div></form>' +
  '<div class="loginerror" style="color:red"></div>';
  let home = document.getElementsByClassName('home');
  home[0].insertBefore(loginform, home[0].childNodes[0]);
  //console.log(home[0].firstChild);
}

validateLogin() {
  //let useridInput = null;
  let useridValue = '';
  //console.log(document.getElementsByClassName('userid')[0]);
  if (document.getElementsByClassName('userid')[0] !== undefined) {
    useridValue = document.getElementsByClassName('userid')[0];
  }
  let email = '';
  let validemail = '';
  if (document.getElementsByClassName('loginemail').length > 0) {
    email = document.getElementsByClassName('loginemail')[0].value;
    validemail = document.getElementsByClassName('loginemail')[0];
  }
  let password = document.getElementsByClassName('loginpass')[0].value;
  let validpass = document.getElementsByClassName('loginpass')[0];
  let logbutton = document.getElementsByClassName('loginbutton')[0];
  let resetpassButton = document.getElementsByClassName('resetpass')[0];
  if (validemail !== '') {
    if (validemail.checkValidity() && validpass.checkValidity()) {
      logbutton.style.display = 'block';
    } else {
      logbutton.style.display = 'none';
    }
  }
  if (useridValue !== '') {
    if (validpass.checkValidity()) {
      logbutton.style.display = 'block';
    } else {
      logbutton.style.display = 'none';
    }
  }
  // } && validpass.checkValidity()) {
  //   logbutton.style.display = 'block';
  // } else {
  //   logbutton.style.display = 'none';
  // }
  if (validemail !== '') {
    if (validemail.checkValidity()) {
      resetpassButton.style.display = 'block';
    } else {
      resetpassButton.style.display = 'none';
    }
  }
  if (useridValue !== '') {
    resetpassButton.style.display = 'block';
  }
}

resetpass(appName) {
  let loginEmail = '';
  //console.log('going to reset your password');
  if (appName !== 'PATRIC') {
    loginEmail = document.getElementsByClassName('loginemail')[0].value;
  } else {
    loginEmail = document.getElementsByClassName('userid')[0].value;
  }
  //put to backend /auth/resetpass
  let bodyData = {'email': loginEmail };
  let fetchData = {
    method: 'PUT',
    body: JSON.stringify(bodyData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return fetch(this.backendUrl + '/auth/resetpass', fetchData)
  .then((response) => response.json())
  .then((data) => {
    //console.log(data);
    if (data.message) {
      //console.log(data.message);
      let messagediv = document.getElementsByClassName('loginerror')[0];
      messagediv.innerHTML = '<p style="text-align:left; padding-left:12px">' + data.message + '</p>';
    } else {
      this.nevermind('LoginForm');
      window.location.href = this.frontendUrl + '/userutil/?email=' + loginEmail + '&form=reset';
    }
  })
  .catch((error) => {
    console.log(error);
    //console.log
  });
}

logMeIn(appName) {
  //let useridInput = null;
  let useridValue = '';
  let emailValue = '';
  const passwordValue = document.getElementsByClassName('loginpass')[0].value;
  //console.log('this is the password given ' + passwordValue);
  //useridInput = document.getElementsByClassName('userid');
  if (document.getElementsByClassName('userid')[0] !== undefined) {
    useridValue = document.getElementsByClassName('userid')[0].value;
    console.log(useridValue);
  }
  if (appName !== 'PATRIC') {
    emailValue = document.getElementsByClassName('loginemail')[0].value;
  }
  let bodyData = {'email': emailValue, 'password': passwordValue, 'id': useridValue };
  //var cookieToken = getCookieToken();
  let fetchData = {
    method: 'POST',
    //credentials: 'same-origin',
    body: JSON.stringify(bodyData),
    headers: {
      //'X-CSRFTOKEN': cookieToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return fetch(this.backendUrl + '/auth/login', fetchData)
  .then((response) => response.json())
  .then((data) => {
    if (data.token !== undefined) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('useremail', data.email);
      this.checkIfLoggedIn();
      this.nevermind('LoginForm');
      if (appName === 'PATRIC') {
        this.getUser(data.email);
      }
    }
    if (data.message) {
      //console.log(data.message);
      let messagediv = document.getElementsByClassName('loginerror')[0];
      messagediv.innerHTML = '<p style="text-align:left; padding-left:12px">' + data.message + '</p>';
    }
    //loginUser();
  })
  .catch((error) => {
    console.log(error);
    //console.log
  });
}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('useremail');
  let hideWithAuth = document.getElementsByClassName('HideWAuth')[0];
  hideWithAuth.style.display = 'block';
  let showWithAuth = document.getElementsByClassName('ShowWAuth')[0];
  showWithAuth.style.display = 'none';
  window.location.href = this.frontendUrl + '/';
}


getUser(useremail) {
  //fetch the user with the auth header
  console.log('put some cool code here for session and cookie and storage or something for this user: ' + useremail);
  let bodyData = {'email': useremail };
  //var cookieToken = getCookieToken();
  let fetchData = {
    method: 'POST',
    //credentials: 'same-origin',
    body: JSON.stringify(bodyData),
    headers: {
      //'X-CSRFTOKEN': cookieToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  };
  return fetch(this.backendUrl + '/user/', fetchData)
  .then((response) => response.json())
  .then((data) => {
    this.generateSession(data);
  })
  .catch((error) => {
    console.log(error);
    //console.log
  });
}

generateSession(user) {
  let fetchData = {
    method: 'POST',
    //credentials: 'same-origin',
    body: JSON.stringify(user),
    headers: {
      //'X-CSRFTOKEN': cookieToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  };
  return fetch(this.frontendUrl + '/gensession/', fetchData)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
    //console.log
  });
}

userAccount() {
  window.location.href = this.frontendUrl + '/userutil/?form=prefs';
}

}


