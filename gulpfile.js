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
var spaServer = require('spa-server');

var assets = [
  'src/**',
  '!src/200.html',
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

gulp.task('clearCache', () => cache.clearAll());

gulp.task('serve', () => {
  const server = spaServer.create({
    path: './dist',
    port: 80,
    fallback: {
      'text/html' : '/200.html'
    }
  });

  server.start();
});

gulp.task('build', ['clean'], () => gulp.start('useref', 'images', 'copy'));
gulp.task('default', ['build', 'serve']);
