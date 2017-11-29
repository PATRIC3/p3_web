const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('../config.js');

test('it runs the srcfiles task to string replace and move the files', () => {
  gulp.task('srcfiles');
});
