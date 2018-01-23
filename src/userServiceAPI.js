const request = require('request');
//const rp = require('request-promise');
exports.fetch = function(url, data) {
return new Promise(function(resolve, reject) {
  request(url, data, (err, response, body) => {
      console.log(body);
      let statusCode = response.toJSON().statusCode;
      //console.log(response.toJSON().statusCode);
      if (body === '') {
      console.log(statusCode);
      resolve(statusCode);
    } else {
      //console.log(response);
          resolve(body);
        }
        //   if (err) {
        //   console.log(err);
        // }
    });
});
};

//exports.
