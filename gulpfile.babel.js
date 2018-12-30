"use strict";

import gulp from 'gulp';
import connect from'gulp-connect'; /* Runs a local dev server */
import open from'gulp-open'; /* Open a URL in a web browser */
import browserify from'browserify'; /* Bundles JS */
import reactify from'reactify'; /* Transforms React JSX to JS */
import source from'vinyl-source-stream'; /* Use conventional text streams with Gulp */
import concat from 'gulp-concat';

var config = {
  port: 3000,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/**/*.js',
    css: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
    ],
    dist: './dist',
    mainJs: './src/main.js'
  }
}

/* Start a local development server */
gulp.task('connect', done => {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true,
    open: true
  });
  done();
});

gulp.task('open', gulp.series(['connect']), done => {
  gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
    done();
});

gulp.task('html', done => {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
    done();
});

gulp.task('js', done => {
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
    done();
});

gulp.task('css', done => {
  gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dist + '/css'));
  done();
});

gulp.task('watch', gulp.parallel(done => {
  gulp.watch(config.paths.html, gulp.series(['html']));
  gulp.watch(config.paths.js, gulp.series(['js']));
  done();
}));

gulp.task('default', gulp.series(['html', 'js', 'css', 'open', 'watch']));
