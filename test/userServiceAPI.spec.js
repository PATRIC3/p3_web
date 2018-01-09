const usapi = require('../src/userServiceAPI.js');
const config = require('../config.js');
const userServiceURL = config.get('userServiceURL');
//const  FormData = require('form-data');
test('it successfully logs in a user', () => {
  //let form = new FormData();
  //form.append
  //let urlenc = new URLSearchParams();
  //urlenc.append('username', 'JoshuaVSherman');
  //urlenc.append('password', 'greentea1');
  //form.append('password', 'greentea1');
  //let bodyData = {username:'JoshuaVSherman', password:'greentea1' };
  let fetchData = {
        method: 'POST',
        headers: {
      //   'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded'
        },
          body: 'username=JoshuaVSherman&password=greentea1'
      };
  return usapi.login(userServiceURL + '/authenticate', fetchData).then((data) => {
    console.log(data);
    //expect(data.indexOf('un=')).not.toBe(-1);
    expect(data.message).toBe(undefined);
  });
});
