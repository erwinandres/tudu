var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
	return gulp.src('src/styles/*.css')
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('dist/assets/css'));
});

gulp.task('scripts', function() {
	return gulp.src('src/scripts/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'));
});

gulp.task('clean', function(){
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
});

gulp.task('default', ['styles', 'scripts']);