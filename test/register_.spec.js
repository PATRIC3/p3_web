const Register = require('../src/register_.js');
//import 'isomorphic-fetch';

let reg = new Register();

test('generates a registration form', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0]).toBeDefined();
  document.body.innerHTML = '';
  //expect(sum(1, 2)).toBe(3);
});

test('hides the submit butten when registration form is not valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
  reg.validateReg();
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
  document.body.innerHTML = '';
  //expect(sum(1, 2)).toBe(3);
});

test('shows the submit butten when registration form is valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return true;
  };
  document.getElementsByClassName('password')[0].checkValidity = mockvalidity;
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  reg.validateReg();
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('block');
  document.body.innerHTML = '';
});

test('shows the hides butten when email format is not valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return false;
  };
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  reg.validateReg();
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
  document.body.innerHTML = '';
});

test('it does not create a new user when there is an response error message from post', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
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
  reg.fetch = mockfetch;
  reg.createUser().then(() => {
    let messagediv1 = document.getElementsByClassName('registererror')[0];
    expect(messagediv1.innerHTML).toMatch(/error/);
  });
});

test('it catches error on create a new user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
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
  reg.fetch = mockfetch;
  return reg.createUser()
  .catch(e => expect(e).toBeTruthy());
});

test('it initiates an email varification', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
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
  reg.fetch = mockfetch;
  reg.createUser().then((data) => {
    expect(data.email).toBe('joe@smith.com');
  });
});

test('it does not initiates an email varification', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.register();
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
  reg.fetch = mockfetch;
  reg.createUser().then((data) => {
    expect(data.email).toBe(null);
  });
});

test('generates a login form', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  let regform = document.getElementsByClassName('LoginForm');
  expect(regform[0]).toBeDefined();
  //document.body.innerHTML = '';
  //expect(sum(1, 2)).toBe(3);
});

test('initiates a reset password request', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  reg.fetch = mockfetch;
  reg.resetpass().then((data) => {
    expect(data.message).toBe(null);
  });
});

test('Does not initiates a reset password request with invalid email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ message: 'incorrect email address' })
    });
  };
  reg.fetch = mockfetch;
  reg.resetpass().then((data) =>{
    expect(data.message).toBe('incorrect email address');
  });
});

test('it catches error on reset password', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  //document.getElementsByClassName('firstname')[0].value = 'Joe';
  //document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  //document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'rejected' })
    });
  };
  reg.fetch = mockfetch;
  return reg.resetpass()
  .catch(e => expect(e).toBeTruthy());
});

test('validates a login form', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  let logbutton = document.getElementsByClassName('loginbutton')[0];
  let resetpassButton = document.getElementsByClassName('resetpass')[0];
  reg.validateLogin();
  expect(logbutton.style.display).toBe('block');
  expect(resetpassButton.style.display).toBe('block');
});

test('login and reset buttons do not display when form is not valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = '';
  document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('loginpass')[0].value = '';
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return false;};
  let logbutton = document.getElementsByClassName('loginbutton')[0];
  let resetpassButton = document.getElementsByClassName('resetpass')[0];
  reg.validateLogin();
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
  //document.body.innerHTML = '';
  //expect(sum(1, 2)).toBe(3);
});

test('login and reset buttons do not display when email is not valid format', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = '33333';
  document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  let logbutton = document.getElementsByClassName('loginbutton')[0];
  let resetpassButton = document.getElementsByClassName('resetpass')[0];
  reg.validateLogin();
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
  document.body.innerHTML = '';
  //expect(sum(1, 2)).toBe(3);
});

test('login the user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith';
  //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ token: 'lsdfldjflsdjlfdjfsjdlf' })
    });
  };
  reg.fetch = mockfetch;
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }};
  window.localStorage = mockStorage;
  document.body.innerHTML += '<div class="ShowWithAuth"></div><div class="HideWithAuth"></div>';
  reg.logMeIn().then((data) => {
    expect(data.token).toBe('lsdfldjflsdjlfdjfsjdlf');
    let showA = document.getElementsByClassName('ShowWithAuth')[0];
    expect(showA.style.display).toBe('block');
  });

});

test('displays error message if login fails', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith';
  //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ message: 'incorrect email or password' })
    });
  };
  reg.fetch = mockfetch;
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }};
  window.localStorage = mockStorage;
  reg.logMeIn().then((data) => {
    expect(data.message).toBe('incorrect email or password');
  });

});


test('catches any login errors', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.loginUser();
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith';
  //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({ error: 'incorrect email or password' })
    });
  };
  reg.fetch = mockfetch;
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }};
  window.localStorage = mockStorage;

  return reg.logMeIn()
  .catch(e => expect(e).toBeTruthy());
});

test('logs out the user', () => {
  const mockStorage = {setItem: function(item, value) {
    //do nothing
  }, removeItem: function(item) {
    //do nothing
  }};
  window.localStorage = mockStorage;
  document.body.innerHTML += '<div class="loginerror"></div><div class="ShowWithAuth"></div><div class="HideWithAuth"></div>';
  reg.logout();
  let showA = document.getElementsByClassName('ShowWithAuth')[0];
  expect(showA.style.display).toBe('none');
});
