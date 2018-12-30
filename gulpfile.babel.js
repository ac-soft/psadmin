"use strict";

import gulp from 'gulp';
import connect from'gulp-connect'; /* Runs a local dev server */
import open from'gulp-open'; /* Open a URL in a web browser */
import browserify from'browserify'; /* Bundles JS */
import reactify from'reactify'; /* Transforms React JSX to JS */
import source from'vinyl-source-stream'; /* Use conventional text streams with Gulp */

var config = {
  port: 3000,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/**/*.js',
    dist: './dist',
    mainJs: './src/main.js'
  }
}

/* Start a local development server */
gulp.task('connect', function(done) {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true,
    open: true
  });
  done();
});

gulp.task('open', gulp.series(['connect']), function(done) {
  gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
    done();
});

gulp.task('html', function(done) {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
    done();
});

gulp.task('js', function(done) {
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
    done();
});

gulp.task('watch', gulp.parallel(done => {
  gulp.watch(config.paths.html, gulp.series(['html']));
  gulp.watch(config.paths.js, gulp.series(['js']));
  done();
}));

gulp.task('default', gulp.series(['html', 'js', 'open', 'watch']));
