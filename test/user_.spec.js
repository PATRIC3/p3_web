const User = require('../src/user_.js');
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

// function testAsync(runAsync) {
//   return (done) => {
//     runAsync().then(done, (e) => { fail(e); done(); });
//   };
// }

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
  user.resetPasswd().then(() => {
    let messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toBe('');
  });
});

test('it displays the error message from reset password PUT', () => {
  // debugger;
  document.body.innerHTML = '<div><div class="home"></div></div>';
  let user = new User();
  user.formType = 'reset';
  user.userEmail = 'joe@smith.com';
  user.verifyEmail();
  let mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'incorrect email'})
    });
  };
  user.fetch = mockfetch;
  document.getElementsByClassName('loginpass')[0].value = 'password1';
  document.getElementsByClassName('code')[0].value = '12345';
  //document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  user.resetPasswd().then(() => {
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
  user.fetch = mockfetch;
  return user.resetPasswd()
  .catch(e => expect(e).toBeTruthy());
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
  user.fetch = mockfetch;
  user.updateUser().then(() => {
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
  user.fetch = mockfetch;
  user.updateUser().then(() => {
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
  user.fetch = mockfetch;
  return user.updateUser()
  .catch(e => expect(e).toBeTruthy());
});

test('if the element does not exist, it does not try to hide it', () => {
  user.nevermind('yoyo');
});

test('it displays the user profile', () => {
  user.formType = 'prefs';
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:none"></div>';
  user.verifyEmail();
  expect(document.getElementsByClassName('UserProfileForm')[0].style.display).toBe('block');
});

test('it does not display the user profile form if the user has not logged in', () => {
  user.formType = 'prefs';
  user.userToken = null;
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:none"></div>';
  user.verifyEmail();
  expect(document.getElementsByClassName('UserProfileForm')[0].style.display).toBe('none');
});

test('it populates the user pref form with the current user attributes', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([{'_id': '12345', 'first_name': 'bob', 'last_name': 'jones', 'affiliation': 'self', 'organisms': 'fish', 'interests': 'fishing', 'email': 'bob@smith.com'}])
    });
  };
  user.fetch = mockfetch;
  //user.userToken = null;
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName"><input class="uprofLastName"><input class="uprofAff"><input class="uprofOrganisms">' +
  '<input class="uprofInterests"><input class="uprofEmail"></div>';
  user.populateForm().then((data) => {
    expect(document.getElementsByClassName('uprofEmail')[0].value).toBe('bob@smith.com');
    expect(user.uid).toBe('12345');
  });
});

test('it updates user with the user prefs form', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'success'})
    });
  };
  user.fetch = mockfetch;
  //user.userToken = null;
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName" value="Bob"><input class="uprofLastName" value="Smith"><input class="uprofAff" value="self"><input class="uprofOrganisms" value="dog">' +
  '<input class="uprofInterests" value="walking"><input class="uprofEmail" value="bob@smith.com"></div>';
  user.updateUserPrefs().then((data) => {
    //expect(document.getElementsByClassName('uprofEmail')[0].value).toBe('bob@smith.com');
    expect(data.message).toBe('success');
  });
});

test('it validates the user prefs form', () => {
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName" value="Bob"><input class="uprofLastName" value="Smith"><input class="uprofAff" value="self"><input class="uprofOrganisms" value="dog">' +
  '<input class="uprofInterests" value="walking"><button class="updateprofbutton"><input class="uprofEmail" value="bob@smith.com"><button class="updateemailbutton"></div>';
  document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return true;};
  user.validateUserPrefs();
  let emailbutton = document.getElementsByClassName('updateemailbutton')[0];
  let userprofbutton = document.getElementsByClassName('updateprofbutton')[0];
  expect(emailbutton.style.display).toBe('block');
  expect(userprofbutton.style.display).toBe('block');
});

test('it validates the user prefs form and email when fields are invalid', () => {
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName" value="Bob b"><input class="uprofLastName" value="Smith"><input class="uprofAff" value="self"><input class="uprofOrganisms" value="dog">' +
  '<input class="uprofInterests" value="walking"><button class="updateprofbutton"><input class="uprofEmail" value="bob@smith.com"><button class="updateemailbutton"></div>';
  document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return false;};
  user.validateUserPrefs();
  let emailbutton = document.getElementsByClassName('updateemailbutton')[0];
  let userprofbutton = document.getElementsByClassName('updateprofbutton')[0];
  expect(emailbutton.style.display).toBe('none');
  expect(userprofbutton.style.display).toBe('none');
});

test('it displays a email varification form for a change email request', () => {
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm"></div>';
  //document.getElementsByClassName('email')[0].value = '';
  user.userEmail = '';
  user.changeEmail = 'bob@smith.com';
  //document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return false;};
  //user.validateUserPrefs();
  //let emailbutton = document.getElementsByClassName('updateemailbutton')[0];
  //let userprofbutton = document.getElementsByClassName('updateprofbutton')[0];
  user.verifyEmail();
  //expect(emailbutton.style.display).toBe('none');
  expect(document.getElementsByClassName('email')[0].value).toBe('bob@smith.com');
});
test('it sends PUT request to change user email', () => {
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
  document.body.innerHTML = '<input class="uprofEmail" value="new@email.com"><div class="loginerror"></div>';
  //document.getElementsByClassName('uprofEmail')[0].value = 'new@email.com';

  return user.changeUserEmail().then(() => {
    let messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toBe('');
    messagediv.innerHTML = '';
  });
});
test('it sends PUT request to change user email and displays error message', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'email is incorrect'})
    });
  };
  user.fetch = mockfetch;
  document.body.innerHTML = '<input class="uprofEmail" value="new@email.com"><div class="loginerror"></div>';
  //document.getElementsByClassName('uprofEmail')[0].value = 'new@email.com';

  return user.changeUserEmail().then(() => {
    let messagediv = document.getElementsByClassName('loginerror')[0];
    expect(messagediv.innerHTML).toBe('<p style="text-align:left; padding-left:12px">email is incorrect</p>');
    messagediv.innerHTML = '';
  });
});
test('it sends PUT request to change user email and catches error', () => {
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
  //document.body.innerHTML = '<input class="uprofEmail" value="new@email.com"><div class="loginerror"></div>';
  //document.getElementsByClassName('uprofEmail')[0].value = 'new@email.com';

  //return user.changeUserEmail().then(() => {
    return user.changeUserEmail()
    .catch(e => expect(e).toBeTruthy());
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
    //document.getElementsByClassName('uprofEmail')[0].value = 'new@email.com';

    //return user.changeUserEmail().then(() => {
      return user.verifyChangeEmail().then(() => {
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
      //document.getElementsByClassName('uprofEmail')[0].value = 'new@email.com';

      //return user.changeUserEmail().then(() => {
        return user.verifyChangeEmail().then(() => {
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
          return user.verifyChangeEmail()
          .catch(e => expect(e).toBeTruthy());
        });
