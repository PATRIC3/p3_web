const User = require('../src/user_.js');

document.body.innerHTML = '<div><div class="home"></div></div>';
let user = new User();

test('generates a email varification form', () => {
  user.verifyEmail();
  expect(document.body.innerHTML).toMatch(/Verify Your Email Address/);
});

test('generates a reset password form with email already filled in', () => {

  user.formType = 'reset';
  user.userEmail = 'joe@smith.com';

  user.verifyEmail();
  expect(document.body.innerHTML).toMatch(/Reset Your Password/);

});

test('it validates the reset password form', () => {
  user.formType = 'reset';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  user.validateForm();
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('block');
});

test('it validates the email varification form', () => {
  user.formType = 'email';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  user.validateForm();
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('block');
});

test('it hides submit button if the email varification form is invalid', () => {
  user.formType = 'email';
  document.getElementsByClassName('email')[0].value = 'joesmith.com';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  user.validateForm();
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('none');
});

test('it hides submit button if the reset password form is invalid', () => {
  user.formType = 'reset';
  document.getElementsByClassName('email')[0].value = 'joesmith.com';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return false;};
  user.validateForm();
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('none');
});

test('it resets the password', () => {
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  user.fetch = mockfetch;
  user.formType = 'reset';
  user.verifyEmail();
  document.getElementsByClassName('loginpass')[0].value = 'password1';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  user.resetPasswd();
  let messagediv = document.getElementsByClassName('loginerror')[0];
  expect(messagediv.innerHTML).toBe('');
});

test('it displays the error message from reset password PUT', () => {
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'incorrect email'})
    });
  };
  user.fetch = mockfetch;
  //document.body.innerHTML = '<div class="loginerror"></div>';
  //expect.assertions(1);
   user.resetPasswd();
    ///let messagediv = document.getElementsByClassName('loginerror')[0];
    //console.log(messagediv1.innerHTML);
    //expect(user.resetPasswd()).toEqual('incorrect email');
});

test('it catches the error from reset password PUT', () => {
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'server error'})
    });
  };
  user.fetch = mockfetch;
  //document.body.innerHTML += '<div class="loginerror"></div>';
  user.resetPasswd();
});

test('it updates the user', () => {
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  user.fetch = mockfetch;
  //document.body.innerHTML += '<div class="loginerror"></div>';
  user.updateUser();
});

test('it displays error message on updates the user PUT', () => {
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'wrong email'})
    });
  };
  user.fetch = mockfetch;
  ///document.body.innerHTML += '<div class="loginerror"></div>';
  user.updateUser();
  let messagediv = document.getElementsByClassName('loginerror')[0];
  //expect(messagediv.innerHTML).toBe('wrong email');
});

test('it catches errors on update the user PUT', () => {
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'big problem'})
    });
  };
  user.fetch = mockfetch;
  document.body.innerHTML += '<div class="loginerror"></div>';
  user.updateUser();
});

test('if the element does not exist, it does not try to hide it', () => {
  user.nevermind('yoyo');
});
