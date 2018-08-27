var     gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		minifycss    = require('gulp-minify-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		concatCss    = require('gulp-concat-css'),
        cleanCss     = require('gulp-clean-css'),
        // clean     = require('gulp-clean'),
        csso           = require('gulp-csso'),
       // vendorJs     = require('gulp-concat-vendor'),
		uglify       = require('gulp-uglify'),
        imagemin     = require('gulp-imagemin'),
        neat = require('node-neat').includePaths,
        bourbon = require('node-bourbon').includePaths,
        csscss = require('gulp-csscss'),
	    php2html = require("gulp-php2html"),
        pngquant     = require('imagemin-pngquant') ;

gulp.task('browser-sync', [
							'scss',
							// 'clean',
							'compressImg',
							//'copyImg',
							'scriptsCommon', //for 'app/js/*.js'
							'htmldist',
							'phpdist', //for php
							'fontsdist',
							'copyLibs',
							'NormalizeCss',
							// 'copyJsExternal',
							], function() {
		browserSync.init({
				server: {
						baseDir: "./dist"
				},
				notify: false
		});
});


gulp.task('scss', function () {
    gulp.src('app/scss/*.scss')
        //.pipe(sass({
        //    includePaths: ['styles'].concat(neat).concat(bourbon),
        //    style: 'compressed',
        //    quiet: true
        //}))
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths,
            style: 'compressed',
            quiet: true
        }))
        .on('error', sass.logError)
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(minifycss(''))
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('cleanImg', function () {
	return gulp.src('./dist/images/', {read: false})
		.pipe(clean());
});
gulp.task('compressImg', function() {
  return gulp.src('app/images/*')
  .pipe(imagemin(''))
  .pipe(gulp.dest('./dist/images/'));
});

gulp.task('copyImg', function() {
	return gulp.src('app/images/*')
		.pipe(gulp.dest('./dist/images/'));
});

gulp.task('scriptsConcat', function() {
  return gulp.src('app/libs/**/*.js')
    .pipe(concat('plagin.min.js'))
    .pipe(uglify(''))
    .pipe(gulp.dest('./dist/libs'));
});

gulp.task('scriptsCommon', function() {
  return gulp.src('app/js/*.js')
    .pipe(concat('common.min.js'))
    .pipe(uglify(''))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('vendor', function () {
  return gulp.src('app/libs/**/*.css')
    .pipe(concatCss("vendor.css"))
    .pipe(minifycss(''))
    .pipe(rename("vendor.min.css"))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copyLibs', function() {
    return gulp.src('app/libs/**/*.*')
        .pipe(gulp.dest('./dist/libs'));
});

gulp.task('copyJsExternal', function() {
    return gulp.src('app/js/**/*.*')
        .pipe(gulp.dest('./dist/js/external/'));
});

gulp.task('cleanCss', function () {
    return gulp.src('app/css/*.css')
        .pipe(cleanCss({compatibility: 'ie8', keepSpecialComments  : '*'}))
        .pipe(rename({extname: '.scss'}))
        .pipe(gulp.dest('app/scss/'));
});

gulp.task('cleanCssMin', function () {
    return gulp.src('app/css/*.css')
        .pipe(cleanCss({compatibility: 'ie8', keepSpecialComments  : '*'}))
		.pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(gulp.dest('app/sss/'));
});

gulp.task('NormalizeCss', function () {
	return gulp.src(['app/css/normalize.css','app/css/reset.css'])
		.pipe(cleanCss({compatibility: 'ie8', keepSpecialComments  : '*'}))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('csso', function() {
    gulp.src('app/css/*.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(rename({extname: '.scss'}))
        .pipe(gulp.dest('app/scss/'));
});

gulp.task('vendorJs', function() {
    gulp.src('app/libs/**/*.js')
        .pipe(concat('vendor.js'))
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(uglify(''))
        .pipe(gulp.dest('./dist/libs/'));
});

gulp.task('htmldist', function() {
  	return gulp.src('app/*.html')
    .pipe(gulp.dest('./dist/'));
});
gulp.task('phpdist', function() {
  	return gulp.src('app/*.php')
    .pipe(rename({extname: '.html'}))
    // .pipe(rename({extname: '.html',basename: 'index'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('php2html', function() {
	return gulp.src("app/*.php")
		.pipe(php2html())
		.pipe(gulp.dest("./dist/"));
});

gulp.task('fontsdist', function() {
  	return gulp.src('app/fonts/*/**')   
    .pipe(gulp.dest('./dist/fonts/'));
});



gulp.task('watch', function () {
	//gulp.watch('app/sass/*.sass', ['styles']).on('change', browserSync.reload);
	gulp.watch('app/scss/*.scss', ['scss']).on('change', browserSync.reload);
	// gulp.watch('app/images/*', ['copyImg']).on('change', browserSync.reload);
	gulp.watch('app/images/*', ['cleanImg']).on('change', browserSync.reload);
	gulp.watch('app/images/*', ['compressImg']).on('change', browserSync.reload);
	// gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js',['scriptsCommon']).on("change", browserSync.reload);
	gulp.watch('app/fonts/*/**',['fontsdist']).on("change", browserSync.reload);
	gulp.watch('app/*.html', ['htmldist']).on('change', browserSync.reload);
	gulp.watch('app/*.php', ['phpdist']).on('change', browserSync.reload);
	// gulp.watch('app/*.php', ['php2html']).on('change', browserSync.reload);
});


gulp.task('default', ['browser-sync', 	'watch']);