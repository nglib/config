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

const SOURCE = ['index.ts', 'src/**/*.ts', 'test/**/*.ts'];
const DIST_FOLDER = path.resolve(__dirname, 'dist');
const DEST_DEV = path.resolve(DIST_FOLDER, 'dev');
const DEST_PROD = path.resolve(DIST_FOLDER, 'prod');
const DEST_PROD_BUNDLES = path.resolve(DEST_PROD, 'bundles');

gulp.task('clean', function (done) {
    rimraf(DIST_FOLDER, done);
});

gulp.task('lint', () => {
    const tslintConfig = require('./tslint.json');
    return gulp.src(SOURCE)
        .pipe(tslint({
            tslint: require('tslint').default,
            configuration: tslintConfig,
            formatter: 'prose',
        }))
        .pipe(tslint.report({emitError: true}));
});

gulp.task('clean:dev', ['lint'], function (done) {
    rimraf(DEST_DEV, done);
});

gulp.task('clean:prod', ['lint'], function (done) {
    rimraf(DEST_PROD, done);
});

gulp.task('tsc:dev', ['clean:dev'], (done) => {
    tsc('tsconfig.json', done);
});

gulp.task('tsc:prod', ['clean:prod'], (done) => {
    tsc('tsconfig.prod.json', done);
});

gulp.task('dev', ['tsc:dev'], () => {
    gulp.watch(SOURCE, {cwd: './'}, ['tsc:dev']);
});

gulp.task('bundle', ['tsc:prod'], (done) => {
    childProcess.spawn(
        path.normalize(platformScriptPath(`${__dirname}/node_modules/.bin/rollup`)),
        ['-c', path.join(__dirname, "rollup.config.js")],
        {stdio: 'inherit'}).on('close', done);
});

gulp.task('prod', ['test', 'bundle'], (done) => {
    gulp.src(path.resolve(DEST_PROD_BUNDLES, 'config.umd.js'))
        .pipe(uglify('config.umd.min.js'))
        .pipe(gulp.dest(DEST_PROD_BUNDLES))
        .on('end', () => {
            gulp.src(['./README.md', './package.json'])
            .pipe(gulp.dest(DEST_PROD))
            .on('end', () => {
                done();
            });
        });
});

gulp.task('test', ['tsc:dev'], (done) => {
    childProcess.spawn(
        path.normalize(platformScriptPath(`${__dirname}/node_modules/.bin/karma`)),
        ['start', path.join(__dirname, "karma.conf.js")],
        {stdio: 'inherit', cwd: process.cwd()})
        .on('exit', (code) => {
            if(code == 0) {
                done();
            }
            else {
                done(code);
            }
        });
});

gulp.task('default', ['dev']);
