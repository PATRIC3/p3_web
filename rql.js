const User  = require('./backend/model/user/user-schema');
//const userModel = require('./backend/model/user/user-facade');
const Rql = require('dactic-store-mongodb/rql');
//let q = new rql(query).toMongo();

exports.findUserRql = function(req, res) {
  console.log('this is the request query ');
  console.log(req.query);
  //let reqqstring = (req.query);
  // let reqq = new Rql(req.query).toMongo();
  // console.log('this is the mongodb query from req query ');
  // console.log(reqq);
  //let testq = 'or(eq(id,JVS),eq(first_name,jv),eq(last_name,jv))' + 'select(id,name)' + 'limit(25)';
  let queryString = Object.keys(req.query)[0] + Object.keys(req.query)[1] + Object.keys(req.query)[2];
let q = new Rql(queryString).toMongo();
//console.log('this is the stringified test query');
//console.log(JSON.stringify(q));
console.log('this is the req query converted to mongodb');
console.log(q);
let limit = null;
if (q[1].limit !== undefined) {
  limit = q[1].limit;
  console.log(limit);
}
let select = null;
if (q[1].select !== undefined) {
  select = q[1].select;
  console.log(select);
}
User.find(q[0])
.limit(limit)
.select(select)
.exec((err, users) => {
  if (users) {
    res.status(200).json(users);
  } else {
  return res.status(404).json({message: 'Not found'});
  }
});
//   if (users) {
//     res.status(200).json(users);
//   } else {
//   return res.status(404).json({message: 'Not found'});
// }
// });
};
//res.send({ message: 'howdy' });
// return when(this.query("or(eq(id," + encodeURIComponent(id) +"),eq(email,"+encodeURIComponent(id)+"))"), function(res){
// 			if (res.results && res.results[0]) {
// 				return res.results[0];
// 			}
//       return res.status(404).send('Not found');
// };
