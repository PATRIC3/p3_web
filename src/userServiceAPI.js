const Fetch = require('isomorphic-fetch');

exports.login = function(route, body) {
  //console.log(body);
  return Fetch(route, body)
  .then((response) => {
    console.log(response);
    console.log(response.Body.status);
  })
    // .then((data) => {
    //   console.log(data);
    // })
    .catch((error) => {
    console.log(error);
  });
};
