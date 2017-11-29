const User_ = require('../../src/classes/User_.js');
let mockfetch;
const mockStorage = {setItem: function(item, value) {
  //do nothing
}, getItem: function(item) {
  //do nothing
}, removeItem: function(item) {
  //do nothing
}
};
window.localStorage = mockStorage;

document.body.innerHTML = '<div><div class="home"></div></div>';
let user = new User_();

test('generates a email varification form', () => {
  user.verifyEmail();
  expect(document.body.innerHTML).toMatch(/Verify Your Email Address/);
});

test('generates a change email varification form', () => {
  user.changeEmail = 'joe@smith.com';
  user.verifyEmail();
  expect(document.getElementsByClassName('email')[0].value).toBe('joe@smith.com');
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
  document.getElementsByClassName('code')[0].value = 12345;
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  let evt = {target: {formType: 'reset'}};
  user.validateForm(evt);
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('block');
});

test('it validates the email varification form', () => {
  user.formType = 'email';
  let evt = {target: {formType: 'email'}};
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  user.validateForm(evt);
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('block');
});

test('it hides submit button if the email varification form is invalid', () => {
  user.formType = 'email';
  let evt = {target: {formType: 'email'}};
  document.getElementsByClassName('email')[0].value = 'joesmith.com';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
  user.validateForm(evt);
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('none');
});

test('it hides submit button if the reset password form is invalid', () => {
  user.formType = 'reset';
  let evt = {target: {formType: 'reset'}};
  document.getElementsByClassName('email')[0].value = 'joesmith.com';
  document.getElementsByClassName('code')[0].value = '12345';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('code')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('loginpass')[0].checkValidity = function() {return false;};
  user.validateForm(evt);
  let sbutton = document.getElementsByClassName('regbutton')[0];
  expect(sbutton.style.display).toBe('none');
});

test('it resets the password', () => {
  mockfetch = function(url, data) {
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
  let evt = {target: {formType: 'reset', fetchClient: mockfetch, runFetch: user.runFetch}};
  user.resetPasswd(evt).then(() => {
    let messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toBe('');
  });
});

test('it displays the error message from reset password PUT', () => {
  document.body.innerHTML = '<div><div class="home"></div></div>';
  user = new User_();
  user.formType = 'reset';
  user.userEmail = 'joe@smith.com';
  user.verifyEmail();
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'incorrect email'})
    });
  };
  let evt = {target: {formType: 'reset', fetchClient: mockfetch, runFetch: user.runFetch}};
  document.getElementsByClassName('loginpass')[0].value = 'password1';
  document.getElementsByClassName('code')[0].value = '12345';
  user.resetPasswd(evt).then(() => {
    const messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toMatch(/incorrect email/);
    messagediv.innerHTML = '';
  });
});

test('it catches the error from reset password PUT', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'server error'})
    });
  };
  let evt = {target: {formType: 'reset', fetchClient: mockfetch, runFetch: user.runFetch}};
  return user.resetPasswd(evt)
  .catch((e) => expect(e).toBeTruthy());
});

test('it updates the user', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: user.runFetch}};
  user.updateUser(evt).then(() => {
    let messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toBe('');
  });
});

test('it displays error message on updates the user PUT', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'wrong email'})
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: user.runFetch}};
  user.updateUser(evt).then(() => {
    let messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toMatch(/wrong email/);
    messagediv.innerHTML = '';
  });
});

test('it catches errors on update the user PUT', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'big problem'})
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: user.runFetch}};
  return user.updateUser(evt)
  .catch((e) => expect(e).toBeTruthy());
});

test('it hides the form', () => {
  document.body.innerHTML = '<div class="form" style="display:block"></div>';
  user.nevermind('form');
  expect(document.getElementsByClassName('form')[0].style.display).toBe('none');
});

test('it displays a email varification form for a change email request', () => {
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm"></div>';
  user.userEmail = '';
  user.changeEmail = 'bob@smith.com';
  user.verifyEmail();
  expect(document.getElementsByClassName('email')[0].value).toBe('bob@smith.com');
});

test('it sends PUT request to varify the changed email with pin', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({success: true})
    });
  };
  user.fetch = mockfetch;
  document.body.innerHTML = '<input class="email" value="new@email.com">' +
  '<input class="code" value="12345"><div class="loginerror"></div>';
  let evt = {target: {fetchClient: mockfetch, runFetch: user.runFetch}};
  return user.verifyChangeEmail(evt).then(() => {
    expect(document.getElementsByClassName('loginerror')[0].innerHTML).toBe('');
  });
});

test('it sends PUT request to varify the changed email with pin and displays error message', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'incorrect pin'})
    });
  };
  user.fetch = mockfetch;
  document.body.innerHTML = '<input class="email" value="new@email.com">' +
  '<input class="code" value="12345"><div class="loginerror"></div>';
  let evt = {target: {fetchClient: mockfetch, runFetch: user.runFetch}};
  return user.verifyChangeEmail(evt).then(() => {
    expect(document.getElementsByClassName('loginerror')[0].innerHTML).toBe('<p style="text-align:left; padding-left:12px">incorrect pin</p>');
  });
});

test('it sends PUT request to varify the changed email with pin and catches error', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'big problem'})
    });
  };
  user.fetch = mockfetch;
  let evt = {target: {fetchClient: mockfetch, runFetch: user.runFetch}};
  return user.verifyChangeEmail(evt)
  .catch((e) => expect(e).toBeTruthy());
});
