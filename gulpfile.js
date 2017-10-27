const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('./config.js');
const RedisServer = require('redis-server');
const server = new RedisServer(6379);

gulp.task('backend', function(){
  gulp.src(['./src/register.js'])
  .pipe(replace('{$BackEndUrl}', config.get('backendUrl')))
  .pipe(gulp.dest('./public/js/'));
  gulp.src(['./src/user.js'])
  .pipe(replace('{$BackEndUrl}', config.get('backendUrl')))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('startredis'), function(){
  server.open((err) => {
    if (err === null) {
      // You may now connect a client to the Redis
      // server bound to `server.port` (e.g. 6379).
    }
  });
}
