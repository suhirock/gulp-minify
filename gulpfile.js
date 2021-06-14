const { src, dest, watch, series, parallel } = require('gulp')
const imagemin = require('gulp-imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const uglifyES = require('gulp-uglify-es').default
const cleanCSS = require('gulp-clean-css')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const webp = require('gulp-webp')
const sass = require('gulp-sass')
const minimist = require('minimist')

// コマンドライン引数取得
// シングルキーで渡すとエラーなのでダブルダッシュ -- で渡すほうが吉
const argv = minimist(process.argv.slice(2))
const _src = argv.src || '_src/'
const _dest = argv.dest || 'assets/'

// concat css
// gulp.task('cssconcat', (done) => {
// 	gulp.src(argv.css)
//     .pipe(concat(argv.build))
//     .pipe(gulp.dest('concat/'));
// 	done();
// });
// gulp.task('cssmin-single', (done) => {
// 	gulp.src(argv.css)
// 	.pipe(cleanCSS())
// 	.pipe(rename({ extname: '.min.css' }))
//     .pipe(gulp.dest('concat/'));
// 	done();
// });


// image minify
const imgmin = () => {
	return src(_src+'images/**/*.{jpg,png,svg,gif}')
		.pipe(imagemin([
			imageminPngquant('70-85'),
			imageminMozjpeg({
				quality: 85
			}),
			imagemin.svgo([
				{ removeViewBox: false },
				{ removeMetadata: false },
				{ removeUnknownsAndDefaults: false },
				{ convertShapeToPath: false },
				{ collapseGroups: false },
				{ cleanupIDs: false },
			]),
			imagemin.gifsicle(),
			imagemin.optipng(),
		]))
		.pipe(dest(_dest+'images/'))
}

// gulp.task('imagemin', (done) => {
	
// 	let _src = argv.src || '_src/images/';
// 	let _dest = argv.dest || 'assets/images/';

// 	gulp.src(_src+'**/*.{jpg,png,svg,gif}')
// 		.pipe(imagemin([
// 			imageminPngquant('70-85'),
// 			imageminMozjpeg({
// 				quality: 85
// 			}),
// 			imagemin.svgo([
// 				{ removeViewBox: false },
// 				{ removeMetadata: false },
// 				{ removeUnknownsAndDefaults: false },
// 				{ convertShapeToPath: false },
// 				{ collapseGroups: false },
// 				{ cleanupIDs: false },
// 			]),
// 			imagemin.gifsicle(),
// 			imagemin.optipng(),
// 		]))
// 		.pipe(gulp.dest(_dest));
		
// 	done();
// 	}
// );

// image webp
// gulp.task('webp', (done) => {
// 	let _src = argv.wsrc || 'assets/images/';
// 	let _dest = argv.wdest || 'assets/images/';
// 	gulp.src(_src+'**/*.{jpg,png,gif,jpeg}')
// 			.pipe(rename(function(path){
// 				path.basename += path.extname
// 			}))
// 			.pipe(webp({
// 				quality: 85,
// 				method: 5
// 			}))
// 			.pipe(gulp.dest(_dest));
// 	done();
// });

// imageex = imagemin + webp
// --src	:	imagemin src
// --dest	:	imagemin dest
// --wsrc	:	webp src
// --wdest	:	webp dest
// gulp.task('imageex',gulp.series('imagemin','webp',function(done){ 
// 	done();
// }));


// css minify
const cssmin = () => {
	return src(_src+'css/*.css')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(cleanCSS())
		.pipe(dest(_dest+'css/'))
}
// gulp.task('cssmin', (done) => {
// 	gulp.src('_src/css/*.css')
// 		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
// 		.pipe(cleanCSS())
// 		.pipe(gulp.dest('assets/css/'));
// 		done();
// 	}
// );

// scss
const scss = () => {
	return src(_src+'css/scss/**/*.scss')
		.pipe(sass({outputStyle: "expanded"}))
		.pipe(dest(_src+'css/'))
}

// js minify
const jsmin = () => {
	return src(_src+'js/*.js')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(uglifyES())
		.pipe(dest(_dest+'js/'))
}
// gulp.task('jsmin', (done) => {
// 	gulp.src('_src/js/*.js')
// 		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
// 		.pipe(uglifyES())
// 		.pipe(gulp.dest('assets/js/'));
// 		done();
// 	}
// );

// watch
const watchFiles = (dn) => {
	watch(_src+'css/scss/**/*.scss',series(scss))
	watch(_src+'css/*.css',series(cssmin))
	watch(_src+'css/*.js',series(jsmin))
}
// gulp.task('watch', (done) => {
// 		gulp.watch('_src/js/*.js', gulp.task('jsmin'));
// 		gulp.watch('_src/css/*.css', gulp.task('cssmin'));
// 		done();
// 	}
// );


// まとめて実行
// gulp.task('default',gulp.series('cssmin','jsmin', function(done){
// 	done();
// }));

exports.default = watchFiles
exports.watch = watchFiles