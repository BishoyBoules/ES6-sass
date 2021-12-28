/* eslint-disable no-undef */
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
//var sass = require('gulp-sass')(require('sass'));
const browserSync = require("browser-sync").create();
const eslint = require('gulp-eslint');
const jasmineBrowser = require('gulp-jasmine-browser');
const concat = require("gulp-concat")
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require("gulp-autoprefixer");

// gulp.task("default", function() {
//   console.log("hello world!");
// });

function style(){
  return gulp.src("sass/**/*.scss")
      .pipe(sass())
      .on("error", sass.logError)
      .pipe(autoprefixer())
      .pipe(gulp.dest("./css"))
  .pipe(browserSync.stream());
}

function scripts (){
    gulp.src('js/**/*.js')
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify('all.js'))
    .pipe(gulp.dest('js'));
}

function dist(){
    [
        style(),
        lint(),
        test(),
        watch()
    ]
}

function lint() {
  return (
      gulp
          .src(['js/**/*.js'])
          // eslint() attaches the lint output to the eslint property
          // of the file object so it can be used by other modules.
          .pipe(eslint())
          // eslint.format() outputs the lint results to the console.
          // Alternatively use eslint.formatEach() (see Docs).
          .pipe(eslint.format())
          // To have the process exit with an error code (1) on
          // lint error, return the stream and pipe to failOnError last.
          .pipe(eslint.failOnError())
  );
}

function watch(){
  gulp.watch('./scss/**/*.scss', style).on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('./js/**/*.js').on('change', browserSync.reload);
  //gulp.watch('js/**/*.js', ['lint']);

    browserSync.init({
        server: './'
    });
}

function test(){
  return gulp
        .src('tests/spec/extraSpec.js')
        .pipe(jasmineBrowser.specRunner({ console: true }))
        .pipe(jasmineBrowser.headless({ }));
}

exports.style = style;
exports.test = test;
exports.lint = lint;
exports.watch = watch;
exports.scripts = scripts;
exports.dist = dist;