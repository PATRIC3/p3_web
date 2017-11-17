const User  = require('./backend/model/user/user-schema');
const Rql = require('dactic-store-mongodb/rql');
//let q = new rql(query).toMongo();

exports.findUserRql = function(req, res) {
let q = new Rql(req.query).toMongo();
console.log('howdy');
User.find(q, (err, users) => {
  if (users) {
    res.status(200).json(users);
  }
  return res.status(404).json({message: 'Not found'});
});
};
//res.send({ message: 'howdy' });
// return when(this.query("or(eq(id," + encodeURIComponent(id) +"),eq(email,"+encodeURIComponent(id)+"))"), function(res){
// 			if (res.results && res.results[0]) {
// 				return res.results[0];
// 			}
//       return res.status(404).send('Not found');
// };
