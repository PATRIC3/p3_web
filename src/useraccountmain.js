const Uact = require('./classes/UserAccount.js');
const userActClass = new Uact();
exports.updateUserPrefs = function() {
    console.log('update user prefs');
    let fname = document.getElementsByClassName('uprofFirstName')[0].value;
    let fspace = fname.split(' ');
    let lname = document.getElementsByClassName('uprofLastName')[0].value;
    let lspace = lname.split(' ');
    if (fname === '' || lname === '' || fspace.length > 1 || lspace.length > 1) {
      console.log('not valid');
      return document.getElementsByClassName('formerrors')[0].innerHTML = '<p>Name is not valid, please fix</p>';
    }
    document.getElementsByClassName('formerrors')[0].innerHTML = '';
    userActClass.updateUserPrefs();
  };

exports.changeUserEmail = function() {
    let isemailvalid = document.getElementsByClassName('uprofEmail')[0].checkValidity();
    let emValue = document.getElementsByClassName('uprofEmail')[0].value;
    let edot = emValue.split('.');
    if (isemailvalid && edot.length > 1) {
      document.getElementsByClassName('formerrors')[0].innerHTML = '';
      userActClass.changeUserEmail();
    } else {
      document.getElementsByClassName('formerrors')[0].innerHTML = '<p>Email address is not valid</p>';
    }
  };
  exports.setupButtons = function() {
  document.getElementsByClassName('updateprofbutton')[0].addEventListener('click', this.updateUserPrefs);
  document.getElementsByClassName('updateemailbutton')[0].addEventListener('click', this.changeUserEmail);
  document.getElementsByClassName('nevermind')[0].addEventListener('click', function() {
    window.location.href = process.env.FrontendUrl + '/';
  });
};
this.setupButtons();
