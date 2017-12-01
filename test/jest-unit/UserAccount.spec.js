const UserAccount = require('../../src/classes/UserAccount.js');
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

document.body.innerHTML = '<div class="UserProfileForm" style="display:none; text-align:center; max-width:4in;"></div>';
let ua = new UserAccount();

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
  ua.fetch = mockfetch;
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName"><input class="uprofLastName"><input class="uprofAff"><input class="uprofOrganisms">' +
  '<input class="uprofInterests"><input class="uprofEmail"></div>';
  ua.populateForm().then((data) => {
    expect(document.getElementsByClassName('uprofEmail')[0].value).toBe('bob@smith.com');
    expect(ua.uid).toBe('12345');
  });
});

test('it redirect to the homepage when the user is not found', () => {
  mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([])
    });
  };
  ua.fetch = mockfetch;
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName"><input class="uprofLastName"><input class="uprofAff"><input class="uprofOrganisms">' +
  '<input class="uprofInterests"><input class="uprofEmail"></div>';
  ua.populateForm().then((data) => {
    expect(document.getElementsByClassName('UserProfileForm')[0].style.display).toBe('none');
    //expect(ua.uid).toBe('12345');
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
  ua.fetch = mockfetch;
  //user.userToken = null;
  document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
  '<input class="uprofFirstName" value="Bob"><input class="uprofLastName" value="Smith"><input class="uprofAff" value="self"><input class="uprofOrganisms" value="dog">' +
  '<input class="uprofInterests" value="walking"><input class="uprofEmail" value="bob@smith.com"></div>';
  ua.updateUserPrefs().then((data) => {
    //expect(document.getElementsByClassName('uprofEmail')[0].value).toBe('bob@smith.com');
    expect(data.message).toBe('success');
  });
});

// test('it validates the user prefs form', () => {
//   document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
//   '<input class="uprofFirstName" value="Bob"><input class="uprofLastName" value="Smith"><input class="uprofAff" value="self"><input class="uprofOrganisms" value="dog">' +
//   '<input class="uprofInterests" value="walking"><button class="updateprofbutton"><input class="uprofEmail" value="bob@smith.com"><button class="updateemailbutton"></div>';
//   document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return true;};
//   ua.validateUserPrefs();
//   let emailbutton = document.getElementsByClassName('updateemailbutton')[0];
//   let userprofbutton = document.getElementsByClassName('updateprofbutton')[0];
//   expect(emailbutton.style.display).toBe('block');
//   expect(userprofbutton.style.display).toBe('block');
// });
//
// test('it validates the user prefs form and email when fields are invalid', () => {
//   document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm" style="display:block">' +
//   '<input class="uprofFirstName" value="Bob b"><input class="uprofLastName" value="Smith"><input class="uprofAff" value="self"><input class="uprofOrganisms" value="dog">' +
//   '<input class="uprofInterests" value="walking"><button class="updateprofbutton"><input class="uprofEmail" value="bob@smith.com"><button class="updateemailbutton"></div>';
//   document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return false;};
//   ua.validateUserPrefs();
//   let emailbutton = document.getElementsByClassName('updateemailbutton')[0];
//   let userprofbutton = document.getElementsByClassName('updateprofbutton')[0];
//   expect(emailbutton.style.display).toBe('none');
//   expect(userprofbutton.style.display).toBe('none');
// });

// test('it displays a email varification form for a change email request', () => {
//   document.body.innerHTML = '<div><div class="home"></div></div><div class="UserProfileForm"></div>';
//   user.userEmail = '';
//   user.changeEmail = 'bob@smith.com';
//   user.verifyEmail();
//   expect(document.getElementsByClassName('email')[0].value).toBe('bob@smith.com');
// });
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
  ua.fetch = mockfetch;
  document.body.innerHTML = '<input class="uprofEmail" value="new@email.com"><div class="loginerror"></div>';
  return ua.changeUserEmail().then(() => {
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
  ua.fetch = mockfetch;
  document.body.innerHTML = '<input class="uprofEmail" value="new@email.com"><div class="formerrors"></div>';
  //document.getElementsByClassName('uprofEmail')[0].value = 'new@email.com';

  return ua.changeUserEmail().then(() => {
    let messagediv = document.getElementsByClassName('formerrors')[0];
    expect(messagediv.innerHTML).toBe('<p style="text-align:center; padding:0">email is incorrect</p>');
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
  ua.fetch = mockfetch;
  return ua.changeUserEmail()
  .catch((e) => expect(e).toBeTruthy());
});
