'use strict';

const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const browerSync = require('browser-sync');
const connect = require('gulp-connect');
const historyApiFallback = require('connect-history-api-fallback');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const imageMin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const fs = require('fs');

const src = './src/';
const dist = './dist/';

gulp.task('clean:dist', (done) => {
  del(dist).then(() => {
    done();
  });
});

gulp.task('compile:js', () => {
  return gulp.src(src + 'index.js')
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(dist));
});

gulp.task('compile:sass', () => {
  return gulp.src(src + '**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: ['node_modules/susy/sass']}).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ browsers: ['> 5%', 'iOS 7'] }) ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist));
});

gulp.task('copy:html', () => {
  return gulp.src(src + '**/*.html')
    .pipe(gulp.dest(dist));
});

gulp.task('copy:images', () => {
  return gulp.src([src + 'assets/**/*.jpg', src + 'assets/**/*.png'])
    .pipe(imageMin())
    .pipe(gulp.dest(dist + 'assets/'));
});

gulp.task('copy:assets', () => {
  return gulp.src([src + 'assets/**/*.*', !src + 'assets/**/*.jpg', !src + 'assets/**/*.png'])
    .pipe(gulp.dest(dist + 'assets/'));
});

gulp.task('watch:html', () => {
  gulp.watch(src + '**/*.html', ['copy:html']);
});

gulp.task('watch:sass', () => {
  gulp.watch([src + 'styles/**/*.scss', src + 'style.scss'], ['compile:sass']);
});

gulp.task('watch:js', () => {
  gulp.watch([src + '**/*.js', '!' + src + '**/*.test.js'], ['compile:js']);
});

gulp.task('build:dev', (done) => {
  runSequence('clean:dist',
    ['compile:js', 'compile:sass', 'copy:html', 'copy:images', 'copy:assets'],
    done);
});


// Development Build
gulp.task('serve:dev', ['build:dev', 'watch:html', 'watch:sass', 'watch:js'], () => {
  browerSync.init({
    files: ['dist/**/*.js', 'dist/**/*.html', 'dist/**/*.css'],
    server: {
      baseDir: ['./dist/', './'],
      middleware: [historyApiFallback()]
    },
    logLevel: 'info',
    port: 3002
  });

});

// Production Build
gulp.task('serve:prod', ['build:dev'], () => {
  connect.server({
    root: ['./dist/', './'],
    port: 3002,
    livereload: false,
    middleware: (connect, opt) => {
      return [ historyApiFallback() ];
    }
  });

});
