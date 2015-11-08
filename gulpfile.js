var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var SCRIPTS_FOLDER = 'public/javascripts/app';
var DEST_FOLDER = 'public/dist';
var MIN_SCRIPTS_FILE = 'scripts.min.js'

gulp.task('scripts', function(){
  return gulp.src([SCRIPTS_FOLDER + '/main.js', SCRIPTS_FOLDER + '/**/*.js'])
    .pipe(ngAnnotate())
    .pipe(concat(MIN_SCRIPTS_FILE))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(DEST_FOLDER));
});

gulp.task('serve', ['scripts'], function(){
  gulp.watch(SCRIPTS_FOLDER + '/**/*.js', ['scripts']);
});
