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


// css minify
const cssmin = () => {
	return src(_src+'css/*.css')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(cleanCSS())
		.pipe(dest(_dest+'css/'))
}

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

// watch
const watchFiles = (dn) => {
	watch(_src+'css/scss/**/*.scss',series(scss))
	watch(_src+'css/*.css',series(cssmin))
	watch(_src+'css/*.js',series(jsmin))
}

// single
exports.scss = scss
exports.cssmin = cssmin
exports.jsmin = jsmin
exports.imgmin = imgmin

// watch
exports.watch = watchFiles

// default
exports.default = series(scss,cssmin,jsmin,imgmin)