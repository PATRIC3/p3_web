class User {
  constructor() {
    this.backendUrl = 'http://localhost:7000';

    this.searchParams = new URLSearchParams(window.location.search); // ?anything=123
    //console.log(searchParams.get('email'));
    this.userEmail = this.searchParams.get('email');
    this.formType = '';
    this.formType += this.searchParams.get('form');
    this.backendUrl = 'http://localhost:7000';
    // var para = document.getElementsByClassName('test');
    // //console.log(para);
    // if(para[0] !== undefined){
    //   para[0].innerHTML += formtype;
    this.verifyEmail();
  }

  verifyEmail() {
    let formTitle = '';
    let passInput = '';
    let formButton = '';
    //console.log('going to verify this address: ' + userEmail);
    let emailVarifyForm = document.createElement('div');
    if (this.formType === 'reset') {
      formTitle = 'Reset Your Password';
      passInput = '<tr><th style="border:none; text-align:left">Password</th></tr><tr><td><input class="loginpass" pattern=".{8,}" title="8 characters minimum" type="password" name="password" style="width:300px;" value="" required onchange="userClass.validateForm()" onfocus="userClass.validateForm()" onkeydown="userClass.validateForm()" onkeyup="userClass.validateForm()"></td></tr>';
      formButton = 'userClass.resetPasswd()';
    } else {
      formTitle = 'Verify Your Email Address';
      formButton = 'userClass.updateUser()';
    }
    emailVarifyForm.className = 'RegistrationForm';
    emailVarifyForm.innerHTML = '<h2 style="margin:0px;padding:4px;font-size:1.2em;text-align:center;background:#eee;">' + formTitle + '</h2><form>' +
    '<div style="padding:2px; margin:10px;"><table><tbody><tr><th style="text-align:left">Email</th></tr><tr><td>' +
    '<input class="email" type="email" name="email" style="width:250px;" required value="" required onchange="userClass.validateForm()" onfocus="userClass.validateForm()" onkeydown="userClass.validateForm()" onkeyup="userClass.validateForm()" onpaste="userClass.validateForm()">' +
    '</td></tr><tr><td> </td></tr>' + passInput + '<tr><td> </td></tr><tr><th style="text-align:left">Code</th></tr><tr><td>' +
    '<input type="text" pattern=".{5,}" title="5 digit code" name="code" class="code" style="width:150px;" required onchange="userClass.validateForm()" onfocus="userClass.validateForm()" onkeydown="userClass.validateForm()" onkeyup="userClass.validateForm()" onpaste="userClass.validateForm()"></td></tr>' +
    '</tbody></table></div><div style="text-align:center;padding:2px;margin:10px;">' +
    '<div><button style="display:none; margin-bottom:-22px;" type="button" class="regbutton" onclick="' + formButton + '">Submit</button><button type="button" onclick="nevermind(&apos;RegistrationForm&apos;)">Cancel</button></div></div></form>' +
    '<div class="loginerror" style="color:red"></div>';
    let home = document.getElementsByClassName('home');
    home[0].insertBefore(emailVarifyForm, home[0].childNodes[0]);
    if (this.userEmail !== '' && this.userEmail !== null && this.userEmail !== undefined) {
      document.getElementsByClassName('email')[0].value = this.userEmail;
    }
    //console.log(home[0].firstChild);
  }

  validateForm() {
    console.log('validating form');
    let newpasswd = '';
    if (this.formType === 'reset') {
      newpasswd = document.getElementsByClassName('loginpass')[0];
    }
    //let fname = document.getElementsByClassName('firstname')[0].value;
    //let lname = document.getElementsByClassName('lastname')[0].value;
    let email = document.getElementsByClassName('email')[0].value;
    let validemail = document.getElementsByClassName('email')[0];
    let codenumber = document.getElementsByClassName('code')[0].value;
    let validcode = document.getElementsByClassName('code')[0];
    let submitbutton = document.getElementsByClassName('regbutton')[0];
    if (email !== '' && codenumber !== '') {
      //console.log('valid');
      //console.log(registbutton);
      console.log(validemail.checkValidity());
      if (validemail.checkValidity() && validcode.checkValidity()) {
        submitbutton.style.display = 'block';
      } else {
        submitbutton.style.display = 'none';
      }
    } else {
      submitbutton.style.display = 'none';
    }
    if (this.formType === 'reset') {
      if (newpasswd.checkValidity() && validemail.checkValidity() && validcode.checkValidity()) {
        submitbutton.style.display = 'block';
      } else {
        submitbutton.style.display = 'none';
      }
    }
  }

  resetPasswd() {
    console.log('going to update your password');
    //put to backend /auth/passwdreset
    let bodyData = {'email': document.getElementsByClassName('email')[0].value,
    'resetCode': document.getElementsByClassName('code')[0].value,
    'password': document.getElementsByClassName('loginpass')[0].value
  };
  let fetchData = {
    method: 'PUT',
    body: JSON.stringify(bodyData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetch(this.backendUrl + '/auth/passwdreset', fetchData)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    if (data.message) {
      console.log(data.message);
      let messagediv = document.getElementsByClassName('loginerror')[0];
      messagediv.innerHTML = '<p style="text-align:left; padding-left:12px">' + data.message + '</p>';
    } else {
      this.nevermind('RegistrationForm');
      window.location.href = '/';
    }
  })
  .catch((error) => {
    console.log(error);
    //console.log
  });

}

updateUser() {
  console.log('going to update user');
  //put to backend /auth/validemail
  let bodyData = {'email': document.getElementsByClassName('email')[0].value, 'resetCode': document.getElementsByClassName('code')[0].value };
  let fetchData = {
    method: 'PUT',
    body: JSON.stringify(bodyData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  // function handleErrors(response) {
  //   if (!response.ok) {
  //     throw Error(response.statusText);
  //   }
  //   return response;
  // }
  fetch(this.backendUrl + '/auth/validemail', fetchData)
  //.then(handleErrors)
  .then((response) => response.json())
  .then((data) => {
    //console.log(data.json());
    //console.log(data.token);
    //const token = data.json();
    console.log(data);

    if (data.message) {
      console.log(data.message);
      let messagediv = document.getElementsByClassName('loginerror')[0];
      messagediv.innerHTML = '<p style="text-align:left; padding-left:12px">' + data.message + '</p>';
    } else {
      this.nevermind('RegistrationForm');
      window.location.href = '/';
    }
  })
  .catch((error) => {
    console.log(error);
    //console.log
  });
}

nevermind(className) {
  let regform1 = document.getElementsByClassName(className);
  if (regform1[0] !== undefined) {
    regform1[0].style.display = 'none';
    window.location.href = '/';

  }
}

}


