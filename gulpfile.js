/*!
 * gulp
 *
 * $ npm install gulp-sass gulp-autoprefixer gulp-cssnano gulp-jshint jshint-stylish gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 *
 * Configure .jshintrc in root directory for linting.
 *
 */

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    mainBowerFiles = require('main-bower-files'),
    jade = require('gulp-jade'),
    del = require('del'),
    paths = {
        // pre-compiled
        _js: './src/js/**/*.js',
        _main_scss: './src/sass/styles.scss',
        _css: './src/css', //ToDo: Remove and add Watch
        _img: './src/img/**/*',
        _index: './src/index.jade',

        // compiled
        js: './dist/assets/js',
        css: './dist/assets/css',
        img: './dist/assets/img',
        index: './dist'
    };

/*          *
 *  Styles  *
 *          */
gulp.task('styles', function() {
    return gulp.src(paths._main_scss, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(paths._css))
        .pipe(gulp.dest(paths.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest(paths.css))
        .pipe(notify({ message: 'Styles task complete' }));
});

/*          *
 *  Scripts *
 *          */
gulp.task('scripts', function() {
    return gulp.src(paths._js)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js))
        .pipe(notify({ message: 'Scripts task complete' }));
});

///*          *
// *  Jade    *
// *          */
//gulp.task('jade', function() {
//    return gulp.src(paths._index)
//        .pipe(jade({
//            jade: jade,
//            pretty: true
//        }))
//        .pipe(gulp.dest(paths.index))
//});



/*          *
 *  Images  *
 *          */
gulp.task('images', function() {
    return gulp.src(paths._img)
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest(paths.img))
        .pipe(notify({ message: 'Images task complete' }));
});

/*          *
 *  Clean   *
 *          */
gulp.task('clean', function() {
    return del(['./dist/assets/css', './dist/assets/js', './dist/assets/img', './dist/assets/lib']);
});

/*          *
 *  Build   *
 *          */
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

/*          *
 *  Watch   *
 *          */
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('./src/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('./src/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('./src/img/**/*', ['images']);

    // Watch Bower installs
    gulp.watch('./src/components/**/*', ['bower']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});

/*          *
 *  Bower   *
 *          *
 *          *
 * Takes main files in 'dist' directory for each Bower  *
 * dependency in ./src/components (defined in .bowerrc) *
 * and pipes to dist/assets/js/lib                      *
 *                                                      *
 *      Important: Needs double checking!               */

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles(/* options */), { base: './src/components' })
        .pipe(gulp.dest('./dist/assets/js/lib'))


});

