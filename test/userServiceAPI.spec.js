const usapi = require('../src/userServiceAPI.js');
const config = require('../config.js');
const userServiceURL = config.get('userServiceURL');
let authString = '';
let userid = 'JoshuaVSherman';

test('it successfully logs in a user', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=' + userid + '&password=greentea1'
  };
  usapi.fetch(userServiceURL + '/authenticate', fetchData).then(function(token) {
    console.log(token);
    expect(token.indexOf('un=')).not.toBe(-1);
    authString = token;
    done();
  });
});

test('it fails to login with incorrect password', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=' + userid + '&password=greenary'
  };
  usapi.fetch(userServiceURL + '/authenticate', fetchData).then(function(token) {
    console.log(token);
    let message = JSON.parse(token);
    console.log(message);
    expect(message.message.indexOf('Invalid')).not.toBe(-1);
    done();
  });
});

test('it fails to login with incorrect username', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=JoshuaVSherman1&password=greentea'
  };
  usapi.fetch(userServiceURL + '/authenticate', fetchData).then(function(token) {
    console.log(token);
    let message = JSON.parse(token);
    console.log(message);
    expect(message.message.indexOf('Invalid')).not.toBe(-1);
    done();
  });
});

test('it gets the user details', (done) => {
  let fetchData = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': authString
    }
  };
  usapi.fetch(userServiceURL + '/user/' + userid, fetchData).then(function(user) {
    console.log(user);
    let userObj = JSON.parse(user);
    console.log(userObj);
    expect(userObj.id).toBe(userid);
    done();
  });
});

test('it gets a token refresh', (done) => {
  let fetchData = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': authString
    }
  };
  usapi.fetch(userServiceURL + '/authenticate/refresh/', fetchData).then(function(newToken) {
    console.log(newToken);
    expect(newToken.indexOf('un=' + userid)).not.toBe(-1);
    expect(newToken).not.toBe(authString);
    done();
    authString = newToken;
  });
});

test('it tries to register when username is already taken', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=JoshuaVSherman&first_name=Josh&last_name=Sherman&email=blah%40blah.com'
  };
  usapi.fetch(userServiceURL + '/register', fetchData).then(function(message) {
  console.log(message);
    const messageText = JSON.parse(message);
    console.log(messageText);
    expect(messageText.message.indexOf('The requested username is already in use')).not.toBe(-1);
    done();
  });
});

test('it tries to register when email is already taken', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=JoshuaVSherman1&first_name=Josh&last_name=Sherman&email=josh73%40vt.edu'
  };
  usapi.fetch(userServiceURL + '/register', fetchData).then(function(message) {
    console.log(message);
    const messageText = JSON.parse(message);
    console.log(messageText);
    expect(messageText.message.indexOf('User with the provided email address already exists')).not.toBe(-1);
    done();
  });
});

test('it updates a user', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
      'X-Requested-With': null,
      'Accept': 'application/json',
      'Authorization': authString
    },
    body: '[{"op":"replace","path":"/first_name","value":"Joshuawha"}]'
  };
  usapi.fetch(userServiceURL + '/user/' + userid, fetchData).then(function(message) {
    console.log(message);
    expect(message).toBe('true');
    done();
  });
});

test('it updates a user', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
      'X-Requested-With': null,
      'Accept': 'application/json',
      'Authorization': authString
    },
    body: '[{"op":"replace","path":"/first_name","value":"Josh"}]'
  };
  usapi.fetch(userServiceURL + '/user/' + userid, fetchData).then(function(message) {
    console.log(message);
    expect(message).toBe('true');
    done();
  });
});

test('it does not modify a user by changing the token string un=username and submitting it with the update user request', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
      'X-Requested-With': null,
      'Accept': 'application/json',
      'Authorization': authString
    },
    body: '[{"op":"replace","path":"/first_name","value":"Joshuawha"}]'
  };
  userid = 'joshhome';
  authString.replace('JoshuaVSherman', 'joshhome');
  console.log(authString);
  usapi.fetch(userServiceURL + '/user/' + userid, fetchData).then(function(message) {
    console.log(message);
    let messageObj = JSON.parse(message);
    console.log(messageObj);
    expect(messageObj.error.status).toBe(401);
    userid = 'JoshuaVSherman';
    authString.replace('joshhome', 'JoshuaVSherman');
    done();
  });
});

test('it requests a password reset', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: 'email=jv.sherman%40yahoo.com'
  };
  usapi.fetch(userServiceURL + '/reset', fetchData).then(function(message) {
    console.log(message);
    expect(message).toBe('OK');
    done();
  });
});

test('it updates a password', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': null,
      'Authorization': authString
    },
    body: '{"id":1, "jsonrpc":"2.0", "method":"setPassword", "params":["JoshuaVSherman", "greentea1", "green"]}'
  };
  usapi.fetch(userServiceURL + '/user/', fetchData).then(function(message) {
    console.log(message);
    const messageText = JSON.parse(message);
    console.log(messageText);
    console.log(messageText.result);
    //expect(false).toBe(true);
    expect(messageText.result).toBe('Password Changed');
    done();
  });
});

test('it updates a password again', (done) => {
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': null,
      'Authorization': authString
    },
    body: '{"id":1, "jsonrpc":"2.0", "method":"setPassword", "params":["JoshuaVSherman", "green", "greentea1"]}'
  };
  usapi.fetch(userServiceURL + '/user/', fetchData).then(function(message2) {
    console.log(message2);
    //expect(false).toBe(true);
    let messageText2 = JSON.parse(message2);
    console.log(messageText2);
    expect(messageText2.result).toBe('Password Changed');
    done();
  });
});

test('it does not allow updating a different user password', (done) => {
  //authString.replace('JoshuaVSherman', 'coolDude');
  let fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': null,
      'Authorization': authString
    },
    body: '{"id":1, "jsonrpc":"2.0", "method":"setPassword", "params":["joshhome", "greentea1", "greenary"]}'
  };
  usapi.fetch(userServiceURL + '/user/', fetchData).then(function(statusCode) {
    console.log(statusCode);
    //expect(false).toBe(true);
    // const messageText = JSON.parse(message);
    // console.log(messageText.result);
    expect(statusCode).toBe(401);
    //authString.replace('coolDude', 'JoshuaVSherman');
    done();
  });
});

test('it does nothing', (done) =>{
  console.log('do nothing');
  console.log('do nothing');
  console.log('do nothing');
  expect(true).toBe(true);
  done();
});
