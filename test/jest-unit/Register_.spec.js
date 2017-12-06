const Register_ = require('../../src/classes/Register_.js');

let reg = new Register_();

test('generates a registration form for PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0]).toBeDefined();
  expect(document.getElementsByClassName('userIdRow')[0].style.display).toBe('block');
});

test('generates a registration form for another app', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'AntoherApp', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0]).toBeDefined();
  expect(document.getElementsByClassName('userIdRow')[0].style.display).toBe('none');
});

test('hides a registration form with click Cancel button', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('nevermind')[0].click();
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0].style.display).toBe('none');
});

test('updates the registration form after selection of primary app is PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'other', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('pas')[0].value = 'PATRIC';
  reg.updateRegForm();
  let uidRowStuff = document.getElementsByClassName('userIdRow')[0];
  expect(uidRowStuff.style.display).toBe('block');
});

test('updates the registration form after selection of primary app is not PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('pas')[0].value = '';
  reg.updateRegForm();
  let uidRowStuff = document.getElementsByClassName('userIdRow')[0];
  expect(uidRowStuff.style.display).toBe('none');
});

test('generates a registration form without userid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'other', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  let userIdRow = document.getElementsByClassName('userIdRow')[0];
  expect(userIdRow.style.display).toBe('none');
});

test('hides the submit button when registration form is not valid email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'other', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('pas')[0].value = 'other';
  document.getElementsByClassName('pas')[0].style.display = 'block';
  document.getElementsByClassName('email')[0].value = 'google.@gmail.com';
  document.getElementsByClassName('email')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  let evt2 = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt2);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
});

test('hides the submit button when registration form is not valid name', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('firstname')[0].value = '';
  let evt2 = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt2);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
});

test('hides the submit button when registration form is not valid password', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('email')[0].value = 'google.@gb.com';
  document.getElementsByClassName('firstname')[0].value = 'Bob';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('password')[0].checkValidity = function() {return false;};
  let evt2 = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt2);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
});

test('shows the submit button when registration form is valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return true;
  };
  document.getElementsByClassName('password')[0].checkValidity = mockvalidity;
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  let evt2 = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt2);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('block');
  document.body.innerHTML = '';
});

test('shows the submit button when registration form uses a Google email with PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@gmail.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return true;
  };
  document.getElementsByClassName('password')[0].checkValidity = mockvalidity;
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  let evt2 = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle, appName: 'PATRIC'}};
  document.getElementsByClassName('pas')[0].style.display = 'none';
  reg.validateReg(evt2);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('block');
  document.body.innerHTML = '';
});

test('hides register button when email format is not valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return false;
  };
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  let evt2 = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt2);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
  document.body.innerHTML = '';
});

test('create a new user for another app', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.appName = '';
  let evt = {target:{appName: 'other', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  document.getElementsByClassName('pas')[0].value = 'CoolApp';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({success: true })
    });
  };
  let evt2 = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  //reg.fetch = mockfetch;
  reg.createUser(evt2).then(() => {
    let messagediv1 = document.getElementsByClassName('registererror')[0];
    expect(messagediv1.innerHTML).toBe('');
  });
});

test('it does not create a new user when there is an response error message from post', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'error' })
    });
  };
  let evt2 = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  //reg.fetch = mockfetch;
  reg.createUser(evt2).then(() => {
    let messagediv1 = document.getElementsByClassName('registererror')[0];
    expect(messagediv1.innerHTML).toMatch(/error/);
  });
});

test('it catches error on create a new user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'rejected' })
    });
  };
  let evt2 = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  return reg.createUser(evt2)
  .catch((e) => expect(e).toBeTruthy());
});

test('it initiates an email varification', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({email: 'joe@smith.com' })
    });
  };
  let evt2 = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  reg.createUser(evt2).then((data) => {
    expect(data.email).toBe('joe@smith.com');
  });
});

test('it does not initiates an email varification', () => {
  document.body.innerHTML = '<div class="home"></div>';
  let evt = {target:{appName: 'PATRIC', createRegistrationForm: reg.createRegistrationForm, patric: reg.patric, setEvents: reg.setEvents, fetchClient: reg.fetch,  runFetch: reg.runFetch, createUser: reg.createUser,
updateRegForm: reg.updateRegForm, validateReg: reg.validateReg, displayRegError: reg.displayRegError, validateGoogle: reg.validateGoogle }};
  reg.register(evt);
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  let evt2 = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  reg.createUser(evt2).then((data) => {
    expect(data.email).toBe(null);
  });
});

test('logs out the user', () => {
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }, removeItem: function(item) {
    //do nothing
  }};
  window.localStorage = mockStorage;
  document.body.innerHTML += '<div class="loginerror"></div><div class="ShowWAuth"></div><div class="HideWAuth"></div>';
  reg.logout();
  let showA = document.getElementsByClassName('ShowWAuth')[0];
  expect(showA.style.display).toBe('none');
});

// test('it navigates to the user preferences page', () => {
//   reg.userAccount();
// });

test('it hides the registration form', () => {
  document.body.innerHTML = '<div><div class="RegistrationForm" style="display:block"></div></div>';
  //reg.register('otherapp');
  reg.patric.nevermind('RegistrationForm');
  expect(document.getElementsByClassName('RegistrationForm')[0].style.display).toBe('none');
});

test('it hides the register and login buttons and displays logout and account if the user is already logged in', () => {
  document.body.innerHTML = '<div class="HideWAuth" style="padding: 6px 2px 0 0;"><button class="regbutton registeruser" type="button">Register</button><button class="regbutton loginuser" type="button">Login</button></div>' +
  '<div class="ShowWAuth" style="padding: 6px 2px 0 0;display:none"><button class="regbutton" type="button" onclick="registerClass.userAccount()">Account</button><button class="regbutton logout" type="button" >Logout</button></div>';
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }, removeItem: function(item) {
    //do nothing
  }, getItem: function(item) {
    return '1234';
  }};
  window.localStorage = mockStorage;
  reg.checkIfLoggedIn();
  expect(document.getElementsByClassName('HideWAuth')[0].style.display).toBe('none');
});

test('it displays the register and login buttons and hides logout and account if the user is not logged in', () => {
  document.body.innerHTML = '<div class="HideWAuth" style="padding: 6px 2px 0 0;"><button class="regbutton registeruser" type="button">Register</button><button class="regbutton loginuser" type="button">Login</button></div>' +
  '<div class="ShowWAuth" style="padding: 6px 2px 0 0;display:none"><button class="regbutton" type="button" onclick="registerClass.userAccount()">Account</button><button class="regbutton logout" type="button" >Logout</button></div>';
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }, removeItem: function(item) {
    //do nothing
  }, getItem: function(item) {
    return null;
  }};
  window.localStorage = mockStorage;
  reg.checkIfLoggedIn();
  expect(document.getElementsByClassName('HideWAuth')[0].style.display).not.toBe('none');
});
