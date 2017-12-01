document.body.innerHTML = '<button class="logout"></button><button class="useraccount"></button>' +
'<button class="registeruser"></button><button class="logintheuser"></button>';
const regmain = require('../../src/regmain.js');
test('it sets up the home page button actions', () => {
  regmain.setupReg();
  document.getElementsByClassName('useraccount')[0].click();
});
