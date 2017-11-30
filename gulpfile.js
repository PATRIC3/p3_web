const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('./config.js');

gulp.task('srcfiles', function() {
  gulp.src(['./src/regmain.js'])
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('frontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/useraccountmain.js'])
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/userutilmain.js'])
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/commons/patric.js'])
  .pipe(gulp.dest('./gulpified/commons/'));
  gulp.src(['./src/classes/Register_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('backendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('frontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
  gulp.src(['./src/classes/User_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('backendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('frontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
  gulp.src(['./src/classes/Login_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('backendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('frontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
  gulp.src(['./src/classes/UserAccount.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('backendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('frontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
});
