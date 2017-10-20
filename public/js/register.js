// var dotenv = require('dotenv');
// var fs = require('fs');
// // ignoring this for testing because it is only used for development purposes
// /* istanbul ignore next */
// if (fs.existsSync('../../../.env')) {
//   dotenv.config({path: '../../../.env'});
// }
var backendUrl = 'http://localhost:7000'; //replace with a global variable that gets inserted during the build process somehow
var register = function(){
  //formtype = 'register';
  //window.location.href = '/user?formtype=register';
  console.log('show me a registration form here!');
  nevermind('LoginForm');
  nevermind('RegistrationForm');
  var regform = document.createElement('div');
  regform.className = 'RegistrationForm';
  regform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC User Registration</h2>'+
  '<form class=""><div style="padding:2px; margin:10px;"><table><tbody>'+
  //'<tr><th>USERNAME</th></tr><tr><td><input type="text" name="username" style="width:150px;"></td></tr>' +
  '<tr><th>First Name <span style="color:red">*</span></th><th>Last Name <span style="color:red">*</span></th></tr><tr><td>' +
  '<input class="firstname" type="text" name="first_name" style="width:300px;">'+
  '</td><td><input class="lastname" type="text" name="last_name" style="width:300px;">'+
  '</td></tr><tr><th colspan="1">Email Address <span style="color:red">*</span></th></tr><tr><td colspan="1"><input class="email" type="email" name="email" style="width:100%;">'+
  '</td></tr><tr><th colspan="1">Password <span style="color:red">*</span></th></tr><tr><td colspan="1"><input class="password" type="password" name="password" style="width:100%;">'+
  '</td></tr><tr><th colspan="2">Organization</th></tr><tr><td colspan="2"><div style="width:100%"><input class="organization" type="text" name="affiliation" value=""></div></td></tr>'+
  '<tr><th colspan="2">Organisms</th></tr><tr><td colspan="2"><div><input class="organisms" type="text" name="organisms" value=""></div></td></tr>'+
  '<tr><th colspan="2">Interests</th></tr><tr><td colspan="2"><div><textarea class="interests" rows="5" cols="50" name="interests" style="height:75px;" value=""></textarea></div></td></tr>'+
  '</tbody></table><p><span style="color:red">*</span> <i>Indicates required field</i></p></div><div style="text-align:center;padding:2px;margin:10px;">'+
  '<div><button type="button" class="regbutton" onclick="createUser()">Register New User</button><button style="margin-left:20px" type="button" onclick="nevermind(&apos;RegistrationForm&apos;)">Cancel</button></div></div></form>';
  var home = document.getElementsByClassName('home');
  home[0].insertBefore(regform, home[0].childNodes[0]);
  //console.log(home[0].firstChild);
}

var createUser = function(){
  console.log('going to create a new user ...');

  fetch(backendUrl + '/hello/sayhi')
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
let firstname = document.getElementsByClassName('firstname')[0].value;
let lastname = document.getElementsByClassName('lastname')[0].value;
let orgString = '';
orgString += document.getElementsByClassName('organization')[0].value;
let organismString = '';
organismString += document.getElementsByClassName('organisms')[0].value;
let userdetString = '';
userdetString += document.getElementsByClassName('interests')[0].value;
  //let comments = document.getElementsByClassName('obscom');
  let bodyData = {'name': firstname + ' ' + lastname, 'email': document.getElementsByClassName('email')[0].value,
  'password': document.getElementsByClassName('password')[0].value,
  'firstname': firstname, 'lastname': lastname,
  'organization': orgString,
  'organisms': organismString,
  'userDetails': userdetString
};
  console.log(bodyData);
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
fetch(backendUrl + '/auth/signup', fetchData)
.then((data) => {
  console.log(data);
  nevermind('RegistrationForm');
  loginUser();
})
.catch((error) => {
  console.log(error);
});

}

var nevermind = function(className){
  var regform1 = document.getElementsByClassName(className);
  if(regform1[0] !== undefined){
    regform1[0].style.display = 'none';
  }
}

var loginUser = function(){
  console.log('show me a login form here!');
  //window.location.href = '/user';
  nevermind('LoginForm');
  nevermind('RegistrationForm');
  var loginform = document.createElement('div');
  loginform.className = 'LoginForm';
  loginform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC Login</h2>'+
  '<form><div style="padding:2px; margin:10px;"><table><tbody><tr><th style="border:none">EMAIL</th></tr><tr><td>' +
  '<input type="text" name="username"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;"></td></tr>'+
  '<tr><th style="border:none">PASSWORD</th></tr><tr><td>' +
  // '<input type="text" name="first_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
  '<input type="password" name="password"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;"></td></tr>'+
  // 	'</td></tr><tr><th colspan="1">EMAIL ADDRESS</th></tr><tr><td colspan="1"><input type="text" name="email"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:100%;">'+
  // 	'</td></tr><tr><th colspan="2">ORGANIZATION</th></tr><tr><td colspan="2"><div style="width:100%"><input type="text" name="affiliation"></div></td></tr>'+
  // '<tr><th colspan="2">ORGANISMS</th></tr><tr><td colspan="2"><div><input type="text" name="organisms"></div></td></tr>'+
  // '<tr><th colspan="2">INTERESTS</th></tr><tr><td colspan="2"><div><textarea rows="5" cols="50" name="interests" style="height:75px;"></textarea></div></td></tr>'+
  '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">'+
  '<div><button type="button" class="regbutton" onclick="logMeIn()">Login</button><button style="margin-left:20px" type="button" onclick="nevermind(&apos;LoginForm&apos;)">Cancel</button></div></div></form>';
  var home = document.getElementsByClassName('home');
  home[0].insertBefore(loginform, home[0].childNodes[0]);
  console.log(home[0].firstChild);
}

var logMeIn = function(){
  let bodyData = {'name': 'tester3', 'email': 'tester3@test.com', 'password': 'password' };
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
  fetch(backendUrl + '/auth/login', fetchData)
  .then((response) => response.json())
  .then((data) => {
  //console.log(data.json());
  //console.log(data.token);
  //const token = data.json();
  console.log(data);
  localStorage.setItem('token', data.token);
  nevermind('LoginForm');
  //loginUser();
  })
  .catch((error) => {
  console.log(error);
  });
}
