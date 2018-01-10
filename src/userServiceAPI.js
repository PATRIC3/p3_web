const request = require('request');
//const rp = require('request-promise');
exports.fetch = function(url, data) {
  //let token = '';
  //console.log(body);
return new Promise(function(resolve, reject) {
  request(url, data, (err, response, body) => {
          //console.log('this is the response');
          //console.log(res);\
          //console.log(body);
          //token = body;
          resolve(body);
    });
});
};

//exports.
