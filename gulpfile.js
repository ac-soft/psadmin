"use strict";

import gulp from 'gulp';
import connect from 'gulp-connect'; /* Runs a local dev server */
import open from 'gulp-open'; /* Open a URL in a web browser */

var config = {
  port: 3000,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    dist: './dist'
    }
}

/* Start a local development server */
gulp.task('connect', function() {
  connect.server({
    root: [dist],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function() {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('default', ['html', 'open']);
