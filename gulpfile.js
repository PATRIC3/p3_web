const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('./config.js');
//const RedisServer = require('redis-server');
//const server = new RedisServer(6379);

gulp.task('srcfiles', function() {
  gulp.src(['./src/register_.js'])
  .pipe(replace('http://localhost:7000', config.get('backendUrl')))
  .pipe(replace('http://localhost:3000', config.get('frontendUrl')))
  .pipe(replace('module.exports = Register;', ''))
  .pipe(replace('const Fetch = require(\'isomorphic-fetch\');', ''))
  .pipe(replace('this.fetch = Fetch;', ''))
  .pipe(replace('this.fetch', 'fetch'))
  .pipe(gulp.dest('./public/js/'));
  gulp.src(['./src/user_.js'])
  .pipe(replace('http://localhost:7000', config.get('backendUrl')))
  .pipe(replace('http://localhost:3000', config.get('frontendUrl')))
  .pipe(replace('const Fetch = require(\'isomorphic-fetch\');', ''))
  .pipe(replace('this.fetch = Fetch;', ''))
  .pipe(replace('this.fetch', 'fetch'))
  .pipe(replace('module.exports = User;', ''))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('startredis', function() {
  // server.open((err) => {
  //   if (err === null) {
  //     // You may now connect a client to the Redis
  //     // server bound to `server.port` (e.g. 6379).
  //   }
  // });
});
