const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('./config.js');

gulp.task('backend', function(){
  gulp.src(['./src/register.js'])
    .pipe(replace('{$BackEndUrl}', config.get('backendUrl')))
    .pipe(gulp.dest('./public/js/'));
    gulp.src(['./src/user.js'])
      .pipe(replace('{$BackEndUrl}', config.get('backendUrl')))
      .pipe(gulp.dest('./public/js/'));
});
