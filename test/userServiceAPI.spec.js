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
    //console.log(token);
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
    body: 'username=' + userid + '&password=green'
  };
  usapi.fetch(userServiceURL + '/authenticate', fetchData).then(function(token) {
    //console.log('is this the error message?');
    let message = JSON.parse(token);
    //console.log(message);
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
    //console.log('is this the error message?');
    let message = JSON.parse(token);
    //console.log(message);
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
    //console.log('is this the error message?');
    let userObj = JSON.parse(user);
    //console.log(userObj);
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
      'Content-Type': 'application/x-xxx-form-urlencoded'
    },
    body: 'username=JoshuaVSherman&first_name=Josh&last_name=Sherman&email=blah%40blah.com'
  };
  usapi.fetch(userServiceURL + 'register', fetchData).then(function(message) {
    console.log(message);
    //const messageText = JSON.parse(message);
    //expect(messageText.message.indexOf('username')).not.toBe(-1);
    //expect(newToken).not.toBe(authString);
    done();
    //authString = newToken;
  });
});
//
//expect(data.message).toBe(undefined);
