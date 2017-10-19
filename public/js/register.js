var register = function(){
  console.log('show me a registration form here!');
  nevermind('LoginForm');
  nevermind('RegistrationForm');
  var regform = document.createElement('div');
  regform.className = 'RegistrationForm';
  regform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC User Registration</h2><form method="post" data-dojo-type="dijit/form/Form">'+
  '<div style="padding:2px; margin:10px;"><table><tbody><tr><th>USERNAME</th></tr><tr><td>' +
  '<input type="text" name="username"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:150px;">'+
  '</td></tr><tr><th>FIRST NAME</th><th>LAST NAME</th></tr><tr><td>' +
  '<input type="text" name="first_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
  '</td><td><input type="text" name="last_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
  '</td></tr><tr><th colspan="1">EMAIL ADDRESS</th></tr><tr><td colspan="1"><input type="text" name="email"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:100%;">'+
  '</td></tr><tr><th colspan="2">ORGANIZATION</th></tr><tr><td colspan="2"><div style="width:100%"><input type="text" name="affiliation"></div></td></tr>'+
  '<tr><th colspan="2">ORGANISMS</th></tr><tr><td colspan="2"><div><input type="text" name="organisms"></div></td></tr>'+
  '<tr><th colspan="2">INTERESTS</th></tr><tr><td colspan="2"><div><textarea rows="5" cols="50" name="interests" style="height:75px;"></textarea></div></td></tr>'+
  '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">'+
  '<div><button type="button" class="regbutton" onclick="createUser()">Register New User</button><button style="margin-left:20px" type="button" onclick="nevermind(&apos;RegistrationForm&apos;)">Cancel</button></div></div></form>';
  var home = document.getElementsByClassName('home');
  home[0].insertBefore(regform, home[0].childNodes[0]);
  //console.log(home[0].firstChild);
}

var createUser = function(){
  console.log('going to create a new user ...');
}

var nevermind = function(className){
  var regform1 = document.getElementsByClassName(className);
  if(regform1[0] !== undefined){
    regform1[0].style.display = 'none';
  }
}

var loginUser = function(){
  console.log('show me a login form here!');
  nevermind('LoginForm');
  nevermind('RegistrationForm');
  var loginform = document.createElement('div');
  loginform.className = 'LoginForm';
  loginform.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">PATRIC Login</h2><form method="post" data-dojo-type="dijit/form/Form">'+
  '<div style="padding:2px; margin:10px;"><table><tbody><tr><th style="border:none">USERNAME or EMAIL</th></tr><tr><td>' +
  '<input type="text" name="username"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;"></td></tr>'+
  '<tr><th style="border:none">PASSWORD</th></tr><tr><td>' +
  // '<input type="text" name="first_name"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;">'+
  '<input type="password" name="password"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:300px;"></td></tr>'+
  // 	'</td></tr><tr><th colspan="1">EMAIL ADDRESS</th></tr><tr><td colspan="1"><input type="text" name="email"/ data-dojo-type="dijit/form/ValidationTextBox" style="width:100%;">'+
  // 	'</td></tr><tr><th colspan="2">ORGANIZATION</th></tr><tr><td colspan="2"><div style="width:100%"><input type="text" name="affiliation"></div></td></tr>'+
  // '<tr><th colspan="2">ORGANISMS</th></tr><tr><td colspan="2"><div><input type="text" name="organisms"></div></td></tr>'+
  // '<tr><th colspan="2">INTERESTS</th></tr><tr><td colspan="2"><div><textarea rows="5" cols="50" name="interests" style="height:75px;"></textarea></div></td></tr>'+
  '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">'+
  '<div><button type="button" class="regbutton" onclick="loginUser()">Login</button><button style="margin-left:20px" type="button" onclick="nevermind(&apos;LoginForm&apos;)">Cancel</button></div></div></form>';
  var home = document.getElementsByClassName('home');
  home[0].insertBefore(loginform, home[0].childNodes[0]);
  console.log(home[0].firstChild);
}
