import gulp from 'gulp';
import tslint from 'gulp-tslint';
import uglify from 'gulp-uglifyjs';
import rimraf from 'rimraf';

function platformScriptPath(path) {
    const os = require('os');
    return /^win/.test(os.platform()) ? `${path}.cmd` : path;
}

gulp.task('clean', function (done) {
    rimraf('./dist', done);
});

gulp.task('lint', () => {
    const tslintConfig = require('./tslint.json');

    return gulp.src(['index.ts', 'src/**/*.ts'])
        .pipe(tslint({
            tslint: require('tslint').default,
            configuration: tslintConfig,
            formatter: 'prose',
        }))
        .pipe(tslint.report({emitError: true}));
});

gulp.task('tsc', ['clean', 'lint'], (done) => {
    const childProcess = require('child_process');
    const path = require('path');

    childProcess
      .spawn(
          path.normalize(platformScriptPath(`${__dirname}/node_modules/.bin/tsc`)),
          ['-p', path.join(__dirname, "tsconfig.json")],
          {stdio: 'inherit'})
      .on('close', done);
});

gulp.task('rollup', ['tsc'], (done) => {
    const childProcess = require('child_process');
    const path = require('path');

    childProcess
      .spawn(
          path.normalize(platformScriptPath(`${__dirname}/node_modules/.bin/rollup`)),
          ['-c', path.join(__dirname, "rollup.config.js")],
          {stdio: 'inherit'})
      .on('close', done);
});

gulp.task('copy', ['rollup'], () => {
    return gulp.src(['./README.md', './package.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['lint', 'tsc', 'rollup', 'copy'], () => {
    return gulp.src('dist/bundles/config.umd.js')
        .pipe(uglify('config.umd.min.js'))
        .pipe(gulp.dest('dist/bundles'));
});

gulp.task('default', ['build']);