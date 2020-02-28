const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const uglifyES = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const svgSprite = require('gulp-svg-sprite');
const minimist = require('minimist');

// コマンドライン引数取得
// シングルキーで渡すとエラーなのでダブルダッシュ -- で渡すほうが吉
const argv = minimist(process.argv.slice(2));

// concat css
gulp.task('cssconcat', (done) => {
	gulp.src(argv.css)
    .pipe(concat('concat.css'))
    .pipe(gulp.dest('concat/'));
	done();
});

// image minify
gulp.task('imagemin', (done) => {
	
	let _src = argv.src || 'src/images/';
	let _dest = argv.dest || 'assets/images/';

	gulp.src(_src+'**/*.{jpg,png,svg,gif}')
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
		.pipe(gulp.dest(_dest));
		
	done();
	}
);

/**
 * create svg sprite
 * 
 * 画像名のIDでシンボル呼び出し
 */
gulp.task('svgsprite', (done) => {

	let _src = argv.src || 'assets/images/svg/';
	let _filename = argv.name || 'bundle.svg';
	let _dest = argv.dest || 'assets/images/svg/';
	
	gulp.src(_src+'*.svg')
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(svgSprite({
			mode:{
				symbol: {
					dest: './',
					sprite: _filename,
				},
			},
			shape: {
				transform: [{
					svgo: {
						plugins: [
							{ removeStyleElement: true },
							{ removeAttrs: { attrs: 'fill' } },
						],
					},
				}],
			},
			svg: {
				xmlDeclaration: true,
				doctypeDeclaration: false,
			}
		}))
		.pipe(gulp.dest(_dest));
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
