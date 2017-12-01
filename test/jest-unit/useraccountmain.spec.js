const mockStorage = {setItem: function(item, value) {
  //do nothing
}, removeItem: function(item) {
  //do nothing
}, getItem: function(item) {
  return '1234';
}};
window.localStorage = mockStorage;
document.body.innerHTML = '<div><input class="uprofFirstName"><input class="uprofLastName"><input class="uprofAff"><input class="uprofOrganisms"><input class="uprofInterests">' +
'<button class="updateprofbutton"></button><button class="updateemailbutton"></button></div><div><input class="uprofEmail"></div>' +
'<div class="formerrors"></div>' +
'<button class="nevermind"></button>';
const useraccountmain = require('../../src/useraccountmain.js');
test('it sets up the user profile button actions', () => {
  useraccountmain.setupButtons();
  document.getElementsByClassName('nevermind')[0].click();
});

test('it validates the name field and displays error when first name is blank', () => {
  useraccountmain.updateUserPrefs();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('<p>Name is not valid, please fix</p>');
});

test('it validates the name field and displays error when last name is blank', () => {
  document.getElementsByClassName('uprofFirstName')[0].value = 'Joe';
  useraccountmain.updateUserPrefs();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('<p>Name is not valid, please fix</p>');
});

test('it validates the name field and displays error when there are spaces in firstname', () => {
  document.getElementsByClassName('uprofFirstName')[0].value = 'Jo e';
  document.getElementsByClassName('uprofLastName')[0].value = 'Smith';
  useraccountmain.updateUserPrefs();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('<p>Name is not valid, please fix</p>');
});

test('it validates the name field and displays error when there are spaces in lastname', () => {
  document.getElementsByClassName('uprofFirstName')[0].value = 'Joe';
  document.getElementsByClassName('uprofLastName')[0].value = 'Sm ith';
  useraccountmain.updateUserPrefs();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('<p>Name is not valid, please fix</p>');
});

test('it validates the name field and updates the user', () => {
  document.getElementsByClassName('uprofFirstName')[0].value = 'Joe';
  document.getElementsByClassName('uprofLastName')[0].value = 'Smith';
  useraccountmain.updateUserPrefs();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('');
});

test('it validates the change email', () => {
  document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return false;};
  useraccountmain.changeUserEmail();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('<p>Email address is not valid</p>');
});

test('it validates the change email when missing a dot', () => {
  document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('uprofEmail')[0].value = 'joe@smith';
  useraccountmain.changeUserEmail();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('<p>Email address is not valid</p>');
});

test('it initiates the change email request', () => {
  document.getElementsByClassName('uprofEmail')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('uprofEmail')[0].value = 'joe@smith.com';
  useraccountmain.changeUserEmail();
  expect(document.getElementsByClassName('formerrors')[0].innerHTML).toBe('');
});
