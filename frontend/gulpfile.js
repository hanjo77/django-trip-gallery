const gulp = require('gulp'),
	del = require('del'),
	stylish = require('jshint-stylish'),
	runSequence = require('run-sequence'),
	open = require('open'),
	webpack = require('webpack'),
	webpackStream = require('webpack-stream'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCss = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	jshint = require('gulp-jshint'),
	imagemin = require('gulp-imagemin'),
	gIf = require('gulp-if'),
	paths = require('./config/paths'),
	webpackConfig = require('./config/webpack'),
	connectConfig = require('./config/connect'),
	browserlistConfig = require('./config/browserlist'),
	devEnv = process.argv.includes('--dev'),
	named = require('vinyl-named'),
	hb = require('gulp-hb'),
	gutil = require('gulp-util'),
	tap = require('gulp-tap'),
	rename = require('gulp-rename'),
	symlink = require('gulp-symlink'),
	vfs = require('vinyl-fs');

gulp.task('clean', () => del(paths.dist.webRoot));

gulp.task('open:browser', () => open('http://localhost:' + connectConfig.port));

gulp.task('open:folder', () => open('dist'));

gulp.task('server', () => connect.server(connectConfig));

gulp.task('handlebars', () => {
	return gulp
		.src('./src/*.hbs')
		.pipe(tap(function(file) {
			// get data from file with same name
			var dataFile = gutil.replaceExtension(file.path, '.data.js'),
				data = require(dataFile);
			// store that data on the file object
			file.data = data;
		}))
		.pipe(hb({
			data: function(file) {
				return file.data;
			},
			partials: './src/partials/*.hbs'
		}))
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(gulp.dest(paths.dist.templates));
});

gulp.task('sass', () => {
	return gulp
		.src(paths.src.files.sass)
		.pipe(plumber())
		.pipe(gIf(devEnv, sourcemaps.init()))
		.pipe(sass.sync())
		.pipe(autoprefixer(browserlistConfig))
		.pipe(gIf(!devEnv, cleanCss()))
		.pipe(gIf(devEnv, sourcemaps.write('.')))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(connect.reload());
});

gulp.task('js:transpile', ['js:lint'], () => {
	return gulp
		.src(paths.src.files.js.entry)
		.pipe(plumber())
		.pipe(named())
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest(paths.dist.js))
		.pipe(connect.reload());
});

gulp.task('js:lint', () => {
	return gulp
		.src(paths.src.files.js.all)
		.pipe(plumber())
		.pipe(
			jshint({
				esversion: 6,
				node: true,
				browser: true,
				eqeqeq: true,
				latedef: true,
				undef: true,
				unused: true,
				varstmt: true,
				module: true,
				strict: true
			})
		)
		.pipe(jshint.reporter(stylish));
});

gulp.task('img', () => {
	return gulp
		.src(paths.src.files.img)
		.pipe(plumber())
		.pipe(changed(paths.dist.img))
		.pipe(
			imagemin([
				imagemin.gifsicle({
					interlaced: true,
					optimizationLevel: 3
				}),
				imagemin.jpegtran({
					progressive: true
				}),
				imagemin.optipng({
					optimizationLevel: 7
				}),
				imagemin.svgo()
			])
		)
		.pipe(gulp.dest(paths.dist.img))
		.pipe(connect.reload());
});

gulp.task('setup-media-symlink', () => {
  return gulp.src('../django/media/')
    .pipe(symlink('./dist/media', { force: true }));
});

gulp.task('copy-media', () => {
	return gulp
		.src(paths.src.files.root, {
			base: paths.src.root
		})
		.pipe(gulp.dest(paths.dist.root))
		.pipe(connect.reload());
});

gulp.task('watch', () => {
	gulp.watch(paths.src.files.sass, ['sass']);
	gulp.watch(paths.src.files.js.all, ['js:transpile']);
	gulp.watch(paths.src.files.img, ['img']);
	gulp.watch(paths.src.files.root, ['copy']);
});

gulp.task('default', cb => {
	runSequence('clean', 'build', 'watch', 'server', 'open:browser', cb);
});

gulp.task('build', cb => {
	runSequence(['handlebars', 'sass', 'js:transpile', 'img', 'setup-media-symlink', 'copy-media'], cb);
});
