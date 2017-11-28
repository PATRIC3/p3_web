// const Register = require('../src/register_.js');
// //import 'isomorphic-fetch';
//
// let reg = new Register();
//
// test('generates a registration form', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   let regform = document.getElementsByClassName('RegistrationForm');
//   expect(regform[0]).toBeDefined();
//   //document.body.innerHTML = '';
//   //expect(sum(1, 2)).toBe(3);
// });
//
// test('generates a registration form without userid', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('DifferentApp');
//   let useridInput = [];
//   //console.log(document.getElementsByClassName('userid')[0]);
//   if (document.getElementsByClassName('userid')[0] !== undefined) {useridInput.push(document.getElementsByClassName('userid')[0]);}
//   //useridInput.push(document.getElementsByClassName('userid')[0]);
//   expect(useridInput.length).toBe(0);
//   //document.body.innerHTML = '';
//   //expect(sum(1, 2)).toBe(3);
// });
//
// test('hides the submit butten when registration form is not valid', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   reg.validateReg();
//   let registbutton = document.getElementsByClassName('registerbutton')[0];
//   expect(registbutton.style.display).toBe('none');
//   document.body.innerHTML = '';
//   //expect(sum(1, 2)).toBe(3);
// });
//
// test('shows the submit butten when registration form is valid', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   document.getElementsByClassName('firstname')[0].value = 'Joe';
//   document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('email')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('password')[0].value = '123456789';
//   const mockvalidity = function() {
//     return true;
//   };
//   document.getElementsByClassName('password')[0].checkValidity = mockvalidity;
//   document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
//   reg.validateReg();
//   let registbutton = document.getElementsByClassName('registerbutton')[0];
//   expect(registbutton.style.display).toBe('block');
//   document.body.innerHTML = '';
// });
//
// test('shows the hides butten when email format is not valid', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   document.getElementsByClassName('firstname')[0].value = 'Joe';
//   document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('email')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('password')[0].value = '123456789';
//   const mockvalidity = function() {
//     return false;
//   };
//   document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
//   document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
//   reg.validateReg();
//   let registbutton = document.getElementsByClassName('registerbutton')[0];
//   expect(registbutton.style.display).toBe('none');
//   document.body.innerHTML = '';
// });
//
// test('it does not create a new user when there is an response error message from post', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   document.getElementsByClassName('firstname')[0].value = 'Joe';
//   document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('email')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('password')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({message: 'error' })
//     });
//   };
//   reg.fetch = mockfetch;
//   reg.createUser('PATRIC').then(() => {
//     let messagediv1 = document.getElementsByClassName('registererror')[0];
//     expect(messagediv1.innerHTML).toMatch(/error/);
//   });
// });
//
// test('it catches error on create a new user', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   document.getElementsByClassName('firstname')[0].value = 'Joe';
//   document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('email')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('password')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.reject({error: 'rejected' })
//     });
//   };
//   reg.fetch = mockfetch;
//   return reg.createUser('OtherApp')
//   .catch(e => expect(e).toBeTruthy());
// });
//
// test('it initiates an email varification', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   document.getElementsByClassName('firstname')[0].value = 'Joe';
//   document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('email')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('password')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({email: 'joe@smith.com' })
//     });
//   };
//   reg.fetch = mockfetch;
//   reg.createUser().then((data) => {
//     expect(data.email).toBe('joe@smith.com');
//   });
// });
//
// test('it does not initiates an email varification', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.register('PATRIC');
//   document.getElementsByClassName('firstname')[0].value = 'Joe';
//   document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('email')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('password')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({})
//     });
//   };
//   reg.fetch = mockfetch;
//   reg.createUser().then((data) => {
//     expect(data.email).toBe(null);
//   });
// });
//
// test('generates a login form', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   let regform = document.getElementsByClassName('LoginForm');
//   expect(regform[0]).toBeDefined();
//   //document.body.innerHTML = '';
//   //expect(sum(1, 2)).toBe(3);
// });
//
// test('generates a login form without userid', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('AdifferentApp');
//   let useridInput = [];
//   if (document.getElementsByClassName('userid')[0] !== undefined) {useridInput.push(document.getElementsByClassName('userid')[0]);}
//   expect(useridInput.length).toBe(0);
// });
//
// test('initiates a reset password request', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   //document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({})
//     });
//   };
//   reg.fetch = mockfetch;
//   reg.resetpass('PATRIC').then((data) => {
//     expect(data.message).toBe(null);
//   });
// });
//
// test('initiates a reset password request for other app', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('otherapp');
//   //document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({})
//     });
//   };
//   reg.fetch = mockfetch;
//   reg.resetpass('otherapp').then((data) => {
//     expect(data.message).toBe(null);
//   });
// });
//
// test('Does not initiates a reset password request with invalid email', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({ message: 'incorrect email address' })
//     });
//   };
//   reg.fetch = mockfetch;
//   reg.resetpass('PATRIC').then((data) =>{
//     expect(data.message).toBe('incorrect email address');
//   });
// });
//
// test('it catches error on reset password', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   //document.getElementsByClassName('firstname')[0].value = 'Joe';
//   //document.getElementsByClassName('lastname')[0].value = 'Smith';
//   document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
//   //document.getElementsByClassName('password')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.reject({error: 'rejected' })
//     });
//   };
//   reg.fetch = mockfetch;
//   return reg.resetpass('PATRIC')
//   .catch(e => expect(e).toBeTruthy());
// });
//
// test('validates a login form with userid and no email', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'user123';
//   //document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
//   let logbutton = document.getElementsByClassName('loginbutton')[0];
//   let resetpassButton = document.getElementsByClassName('resetpass')[0];
//   reg.validateLogin();
//   expect(logbutton.style.display).toBe('block');
//   //expect(resetpassButton.style.display).toBe('block');
// });
//
// test('validates a login form without userid', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('OtherApp');
//   document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('loginemail')[0].checkValidity = function() {return true;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
//   let logbutton = document.getElementsByClassName('loginbutton')[0];
//   let resetpassButton = document.getElementsByClassName('resetpass')[0];
//   reg.validateLogin();
//   expect(logbutton.style.display).toBe('block');
//   expect(resetpassButton.style.display).toBe('block');
// });
//
// test('validates a login form without useremail and invalid password', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'joesmith';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return true;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function() {return false;};
//   let logbutton = document.getElementsByClassName('loginbutton')[0];
//   let resetpassButton = document.getElementsByClassName('resetpass')[0];
//   reg.validateLogin();
//   expect(logbutton.style.display).toBe('none');
//   expect(resetpassButton.style.display).toBe('block');
// });
//
// test('It displays reset password button', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return true;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
//   let logbutton = document.getElementsByClassName('loginbutton')[0];
//   let resetpassButton = document.getElementsByClassName('resetpass')[0];
//   reg.validateLogin();
//   expect(logbutton.style.display).toBe('block');
//   expect(resetpassButton.style.display).toBe('block');
// });
//
// test('login and reset buttons do not display when email is not valid format', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('OtherApp');
//   document.getElementsByClassName('loginemail')[0].value = '33333';
//   document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function() {return true;};
//   let logbutton = document.getElementsByClassName('loginbutton')[0];
//   let resetpassButton = document.getElementsByClassName('resetpass')[0];
//   reg.validateLogin();
//   expect(logbutton.style.display).toBe('none');
//   expect(resetpassButton.style.display).toBe('none');
//   document.body.innerHTML = '';
//   //expect(sum(1, 2)).toBe(3);
// });
//
// test('login the PATRIC user', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'joe@smith';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({ token: 'lsdfldjflsdjlfdjfsjdlf' })
//     });
//   };
//   reg.fetch = mockfetch;
//   const mockStorage = {setItem: function(item, value) {
//     //do nothing
//   }, getItem: function(item, value) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML += '<div class="ShowWAuth"></div><div class="HideWAuth"></div>';
//   reg.logMeIn('PATRIC').then((data) => {
//     expect(data.token).toBe('lsdfldjflsdjlfdjfsjdlf');
//     let showA = document.getElementsByClassName('ShowWAuth')[0];
//     expect(showA.style.display).toBe('block');
//   });
// });
//
// test('login the other app user', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('OtherApp');
//   document.getElementsByClassName('loginemail')[0].value = 'joe@smith';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({ token: 'lsdfldjflsdjlfdjfsjdlf' })
//     });
//   };
//   reg.fetch = mockfetch;
//   const mockStorage = {setItem: function(item, value) {
//     //do nothing
//   }, getItem: function(item, value) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML += '<div class="ShowWAuth"></div><div class="HideWAuth"></div>';
//   reg.logMeIn('OtherApp').then((data) => {
//     expect(data.token).toBe('lsdfldjflsdjlfdjfsjdlf');
//     let showA = document.getElementsByClassName('ShowWAuth')[0];
//     expect(showA.style.display).toBe('block');
//   });
// });
//
// test('displays error message if login fails', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'joe@smith';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({ message: 'incorrect email or password' })
//     });
//   };
//   reg.fetch = mockfetch;
//   const mockStorage = {setItem: function(item, value) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   reg.logMeIn('PATRIC').then((data) => {
//     expect(data.message).toBe('incorrect email or password');
//   });
//
// });
//
// test('catches any login errors', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.loginUser('PATRIC');
//   document.getElementsByClassName('userid')[0].value = 'joe@smith';
//   //document.getElementsByClassName('loginemail')[0].checkValidity = function() {return false;};
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.reject({ error: 'incorrect email or password' })
//     });
//   };
//   reg.fetch = mockfetch;
//   const mockStorage = {setItem: function(item, value) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//
//   return reg.logMeIn('PATRIC')
//   .catch(e => expect(e).toBeTruthy());
// });
//
// test('logs out the user', () => {
//   const mockStorage = {setItem: function(item, value) {
//     //do nothing
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML += '<div class="loginerror"></div><div class="ShowWAuth"></div><div class="HideWAuth"></div>';
//   reg.logout();
//   let showA = document.getElementsByClassName('ShowWAuth')[0];
//   expect(showA.style.display).toBe('none');
// });
//
// test('Generates a session for PATRIC', () => {
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({ message: 'success' })
//     });
//   };
//   reg.fetch = mockfetch;
//   const mockStorage = {getItem: function(item, value) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   reg.generateSession('joe@smith.com').then((data) => {
//     expect(data.message).toBe('success');
//   });
// });
//
// test('it displays account and logout buttons when the user is logged in', () => {
//   const mockStorage = {getItem: function(item, value) {
//     return '12345';
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML = '<div class="HideWAuth"></div><div class="ShowWAuth"></div>';
//   reg.checkIfLoggedIn();
//   expect(document.getElementsByClassName('ShowWAuth')[0].style.display).toBe('block');
//   expect(document.getElementsByClassName('HideWAuth')[0].style.display).toBe('none');
// });
//
// test('it does not displays account and logout buttons when the user is not logged in', () => {
//   const mockStorage = {getItem: function(item, value) {
//     return null;
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML = '<div class="HideWAuth" style="display:block"></div><div class="ShowWAuth" style="display:none"></div>';
//   reg.checkIfLoggedIn();
//   expect(document.getElementsByClassName('ShowWAuth')[0].style.display).toBe('none');
//   expect(document.getElementsByClassName('HideWAuth')[0].style.display).toBe('block');
// });
//
// test('it navigates to the user preferences page', () => {
//   reg.userAccount();
// });
