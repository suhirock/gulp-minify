const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const uglifyES = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// image minify
gulp.task('imagemin', (done) => {
	gulp.src('src/images/**/*.{jpg,png,svg,gif}')
		.pipe(imagemin([
			imageminPngquant('70-85'),
			imageminMozjpeg({
				quality: 85
			}),
			imagemin.svgo(),
			imagemin.gifsicle(),
			imagemin.optipng(),
		]))
		.pipe(gulp.dest('assets/images/'));
		done();
	}
);

// css minify
gulp.task('cssmin', (done) => {
	gulp.src('src/css/*.css')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('assets/css/'));
		done();
	}
);

// js minify
gulp.task('jsmin', (done) => {
	gulp.src('src/js/*.js')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(uglifyES())
		.pipe(gulp.dest('assets/js/'));
		done();
	}
);

// watch
gulp.task('watch', (done) => {
		gulp.watch('src/js/*.js', gulp.task('jsmin'));
		gulp.watch('src/css/*.css', gulp.task('cssmin'));
		done();
	}
);


// まとめて実行
gulp.task('default',gulp.series('cssmin','jsmin', function(done){
	done();
}));
