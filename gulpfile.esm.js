import {
  src,
  dest,
  watch,
  series,
  parallel,
} from 'gulp';
import rename from 'gulp-rename';
import del from 'del';

const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

export function clean() {
  return del([
    'dist',
  ]);
}

export function scss() {
  return src([
      './src/scss/main.scss',
      '!./src/scss/**/__user-template.scss',
    ], {
      allowEmpty: true,
      sourcemaps: true,
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('styles.css'))
    .pipe(dest('./dist/css', {
      sourcemaps: '.',
    }));
}

export function html() {
  return src([
      './src/html/**/*.html',
      '!./src/html/**/__user-template.html',
    ])
    .pipe(dest('./dist'));
}

export function images() {
  return src('./src/images/**/*.+(jpg|png|svg|gif)')
    .pipe(dest('./dist/images'));
}

export function test(cb) {
  console.log('GULP TEST');
  cb();
}

function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
    port: 5001,
  });

  cb();
}

function browserSyncReload(cb) {
  browserSync.reload();

  cb();
}

export const build = series(clean, parallel(scss, html, images));

export const watching = function() {
  watch([
    './src/scss/**/*.scss',
    './src/html/**/*.html',
    './src/images/**/*.+(jpg|png|svg|gif)',
    '!./src/scss/**/__user-template.scss',
    '!./src/html/**/__user-template.html',
  ], series(build, browserSyncReload));
};

export const dev = parallel(series(build, browserSyncServe), watching);

export default test;
