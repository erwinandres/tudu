var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var useref = require('gulp-useref');
var del = require('del');

var assets = [
  'src/**',
  '!src/index.html',
  '!src/styles{,/**}',
  '!src/img{,/**}',
  '!src/scripts{,/**}'
];

gulp.task('useref', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', autoprefixer({ browsers: ['last 2 versions'], cascade: false })))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist/'))
});

gulp.task('images', function(){
    return gulp.src('src/img/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/img'))
});

gulp.task('copy', function() {
  return gulp.src(assets)
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', function(){
    return del('dist/**/*');
});

gulp.task('default', ['clean'], function() {
  gulp.start('useref', 'images', 'copy');
});
