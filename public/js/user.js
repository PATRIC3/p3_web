
var searchParams = new URLSearchParams(window.location.search); //?anything=123
console.log(searchParams.get('email'));
var userEmail = searchParams.get('email');
var backendUrl = 'http://localhost:7000'; //TODO replace with a global variable that gets inserted during the build process somehow
// var para = document.getElementsByClassName('test');
// //console.log(para);
// if(para[0] !== undefined){
//   para[0].innerHTML += formtype;
// }

var verifyEmail = function(){
  console.log('going to verify this address: ' + userEmail);
    var emailVarifyForm = document.createElement('div');
    emailVarifyForm.className = 'RegistrationForm';
    emailVarifyForm.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">Verify Your Email Address</h2><form>'+
    '<div style="padding:2px; margin:10px;"><table><tbody><tr><th style="text-align:left">Email</th></tr><tr><td>' +
    '<input class="email" type="email" name="email" style="width:250px;" required value="" required onchange="validateForm()" onfocus="validateForm()" onkeydown="validateForm()" onkeyup="validateForm()">'+
    '</td></tr><tr><td> </td></tr><tr><th style="text-align:left">Code</th></tr><tr><td>' +
    '<input type="text" pattern=".{5,}" title="5 digit code" name="code" class="code" style="width:150px;" required onchange="validateForm()" onfocus="validateForm()" onkeydown="validateForm()" onkeyup="validateForm()"></td></tr>' +
    '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">'+
    '<div><button style="display:none; margin-bottom:-22px;" type="button" class="regbutton" onclick="updateUser()">Submit</button><button type="button" onclick="nevermind(&apos;RegistrationForm&apos;)">Cancel</button></div></div></form>';
    var home = document.getElementsByClassName('home');
    home[0].insertBefore(emailVarifyForm, home[0].childNodes[0]);
    if(userEmail !=='' && userEmail !== null && userEmail !== undefined){
      document.getElementsByClassName('email')[0].value = userEmail;
    }
    //console.log(home[0].firstChild);
}

var validateForm = function(){
  console.log('validating form');
  //let fname = document.getElementsByClassName('firstname')[0].value;
  //let lname = document.getElementsByClassName('lastname')[0].value;
  let email = document.getElementsByClassName('email')[0].value;
  let validemail = document.getElementsByClassName('email')[0];
  let codenumber = document.getElementsByClassName('code')[0].value;
  let validcode = document.getElementsByClassName('code')[0];
  let submitbutton = document.getElementsByClassName('regbutton')[0];
  if(email !=='' && codenumber !== ''){
    //console.log('valid');
    //console.log(registbutton);
    console.log(validemail.checkValidity());
    if(validemail.checkValidity() && validcode.checkValidity()){
      submitbutton.style.display = 'block';
    } else {
      submitbutton.style.display = 'none';
    }
  } else{
    submitbutton.style.display = 'none';
  }
}

var updateUser = function(){
  console.log('going to update user');
  nevermind('RegistrationForm');
}

// var register = function(){
//   //formtype = 'register';
//   //window.location.href = '/user?formtype=register';
//   console.log('show me a registration form here!');
//   // nevermind('LoginForm');
//   // nevermind('RegistrationForm');
//   var regform = document.createElement('div');
//   regform.className = 'RegistrationForm';
//   regform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC User Registration</h2><form method="post" data-dojo-type="dijit/form/Form">'+
//   '<div style="padding:2px; margin:10px;"><table><tbody><tr><th>USERNAME</th></tr><tr><td>' +
//   '<input type="text" name="username"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:150px;">'+
//   '</td></tr><tr><th>FIRST NAME</th><th>LAST NAME</th></tr><tr><td>' +
//   '<input type="text" name="first_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
//   '</td><td><input type="text" name="last_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
//   '</td></tr><tr><th colspan="1">EMAIL ADDRESS</th></tr><tr><td colspan="1"><input type="text" name="email"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:100%;">'+
//   '</td></tr><tr><th colspan="2">ORGANIZATION</th></tr><tr><td colspan="2"><div style="width:100%"><input type="text" name="affiliation"></div></td></tr>'+
//   '<tr><th colspan="2">ORGANISMS</th></tr><tr><td colspan="2"><div><input type="text" name="organisms"></div></td></tr>'+
//   '<tr><th colspan="2">INTERESTS</th></tr><tr><td colspan="2"><div><textarea rows="5" cols="50" name="interests" style="height:75px;"></textarea></div></td></tr>'+
//   '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">'+
//   '<div><button type="button" class="regbutton" onclick="createUser()">Register New User</button><button style="margin-left:20px" type="button" onclick="nevermind(&apos;RegistrationForm&apos;)">Cancel</button></div></div></form>';
//   var home = document.getElementsByClassName('home');
//   home[0].insertBefore(regform, home[0].childNodes[0]);
//   //console.log(home[0].firstChild);
// }
//
// var createUser = function(){
//   console.log('going to create a new user ...');
//   console.log(backendUrl);
//   fetch(backendUrl + '/hello/sayhi')
//   .then((resp) => resp.json())
//   .then((data) => {
//     console.log(data);
//     // upf[0].innerHTML += '<textarea rows="6" cols="50">' + JSON.stringify(data) + '</textarea>';
//     // upf[0].scrollIntoView();
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// }
//
var nevermind = function(className){
  var regform1 = document.getElementsByClassName(className);
  if(regform1[0] !== undefined){
    regform1[0].style.display = 'none';
    window.location.href = '/';

  }
}
//
// var loginUser = function(){
//   console.log('show me a login form here!');
//   // nevermind('LoginForm');
//   // nevermind('RegistrationForm');
//   var loginform = document.createElement('div');
//   loginform.className = 'LoginForm';
//   loginform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC Login</h2><form method="post" data-dojo-type="dijit/form/Form">'+
//   '<div style="padding:2px; margin:10px;"><table><tbody><tr><th style="border:none">USERNAME or EMAIL</th></tr><tr><td>' +
//   '<input type="text" name="username"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;"></td></tr>'+
//   '<tr><th style="border:none">PASSWORD</th></tr><tr><td>' +
//   // '<input type="text" name="first_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
//   '<input type="password" name="password"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;"></td></tr>'+
//   // 	'</td></tr><tr><th colspan="1">EMAIL ADDRESS</th></tr><tr><td colspan="1"><input type="text" name="email"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:100%;">'+
//   // 	'</td></tr><tr><th colspan="2">ORGANIZATION</th></tr><tr><td colspan="2"><div style="width:100%"><input type="text" name="affiliation"></div></td></tr>'+
//   // '<tr><th colspan="2">ORGANISMS</th></tr><tr><td colspan="2"><div><input type="text" name="organisms"></div></td></tr>'+
//   // '<tr><th colspan="2">INTERESTS</th></tr><tr><td colspan="2"><div><textarea rows="5" cols="50" name="interests" style="height:75px;"></textarea></div></td></tr>'+
//   '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">'+
//   '<div><button type="button" class="regbutton" onclick="loginUser()">Login</button><button style="margin-left:20px" type="button" onclick="nevermind(&apos;LoginForm&apos;)">Cancel</button></div></div></form>';
//   var home = document.getElementsByClassName('home');
//   home[0].insertBefore(loginform, home[0].childNodes[0]);
//   console.log(home[0].firstChild);
// }

verifyEmail();
// var displayform = function(){
  // if(formtype === 'register'){
  //   register();
  // }else {
  //   loginUser();
  // }
// }
