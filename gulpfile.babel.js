import gulp from 'gulp';
import tslint from 'gulp-tslint';
import uglify from 'gulp-uglifyjs';
import rimraf from 'rimraf';
import os from 'os';
import path from 'path';
import childProcess from 'child_process';

function platformScriptPath(path) {
    return /^win/.test(os.platform()) ? `${path}.cmd` : path;
}

function tsc(tsconfig, done) {
    childProcess
      .spawn(
          path.normalize(platformScriptPath(`${__dirname}/node_modules/.bin/tsc`)),
          ['-p', path.join(__dirname, tsconfig)],
          {stdio: 'inherit'})
      .on('close', done);
}

const DEST_FOLEDER = path.resolve(__dirname, 'dist');;
const DEST_CONFIG = path.resolve(DEST_FOLEDER, 'config');
const DEST_BUNDLES = path.resolve(DEST_CONFIG, 'bundles');
const DEST_ALL = path.resolve(DEST_FOLEDER, 'all');

gulp.task('clean:config', ['lint'], function (done) {
    rimraf(DEST_CONFIG, done);
});
gulp.task('clean:all', ['lint'], function (done) {
    rimraf(DEST_ALL, done);
});
gulp.task('clean', function (done) {
    rimraf(DEST_FOLEDER, done);
});

gulp.task('lint', () => {
    const tslintConfig = require('./tslint.json');
    return gulp.src(['index.ts', 'src/**/*.ts', 'test/**/*.ts'])
        .pipe(tslint({
            tslint: require('tslint').default,
            configuration: tslintConfig,
            formatter: 'prose',
        }))
        .pipe(tslint.report({emitError: true}));
});

gulp.task('tsc:config', ['lint', 'clean:config'], (done) => {
    tsc('tsconfig.build.json', done);
});

gulp.task('tsc:all', ['clean:all', 'lint'], (done) => {
    tsc('tsconfig.json', done);
});

gulp.task('tsc', ['tsc:config', 'tsc:all']);

gulp.task('rollup', ['tsc:config'], (done) => {
    childProcess
      .spawn(
          path.normalize(platformScriptPath(`${__dirname}/node_modules/.bin/rollup`)),
          ['-c', path.join(__dirname, "rollup.config.js")],
          {stdio: 'inherit'})
      .on('close', done);
});

gulp.task('copy', ['rollup'], () => {
    return gulp.src(['./README.md', './package.json'])
        .pipe(gulp.dest(DEST_CONFIG));
});

gulp.task('build', ['lint', 'tsc:config', 'rollup', 'copy'], () => {
    return gulp.src(path.resolve(DEST_BUNDLES, 'config.umd.js'))
        .pipe(uglify('config.umd.min.js'))
        .pipe(gulp.dest(DEST_BUNDLES));
});

gulp.task('watch', () => {
    gulp.watch(['index.ts', 'src/**/*.ts', 'test/**/*.ts'], {cwd: './'}, ['rollup', 'tsc:all']);
});


gulp.task('default', ['build']);
