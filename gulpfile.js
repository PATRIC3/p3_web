const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('./config.js');
//console.log(config.get('backendUrl'));
//const RedisServer = require('redis-server');
//const server = new RedisServer(6379);

gulp.task('srcfiles', function() {
  gulp.src(['./src/main.js'])
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/commons/patric.js'])
  .pipe(gulp.dest('./gulpified/commons/'));
  gulp.src(['./src/classes/Register_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('backendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('frontendUrl') + '\''))
  //.pipe(replace('module.exports = Register;', ''))
  //.pipe(replace('const Fetch = require(\'isomorphic-fetch\');', ''))
  //.pipe(replace('this.fetch = Fetch;', ''))
  //.pipe(replace('this.fetch', 'fetch'))
  .pipe(gulp.dest('./gulpified/classes/'));
  // gulp.src(['./src/user_.js'])
  // .pipe(replace('http://localhost:7000', config.get('backendUrl')))
  // .pipe(replace('http://localhost:3000', config.get('frontendUrl')))
  // .pipe(replace('const Fetch = require(\'isomorphic-fetch\');', ''))
  // .pipe(replace('this.fetch = Fetch;', ''))
  // .pipe(replace('this.fetch', 'fetch'))
  // .pipe(replace('module.exports = User;', ''))
  // .pipe(gulp.dest('./public/js/'));
});

// gulp.task('startredis', function() {
//   // server.open((err) => {
//   //   if (err === null) {
//   //     // You may now connect a client to the Redis
//   //     // server bound to `server.port` (e.g. 6379).
//   //   }
//   // });
// });
