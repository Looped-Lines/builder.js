import gulp = require('gulp');
import ts = require('gulp-typescript');
import sourceMaps = require('gulp-sourcemaps');
import {run} from './source/helpers/run';

gulp.task('pre-push', ['test']);

gulp.task('test', ['compile'], () => {
    return run('istanbul', 'cover --root build/local -x **/**UnitTest.js --dir ./build/coverage ./node_modules/mocha/bin/_mocha build/**/**UnitTest.js');
});

gulp.task('compile', function () {
    const tsProject = ts.createProject('tsconfig.json');

    return gulp.src('source/**/*.ts')
        .pipe(sourceMaps.init())
        .pipe(tsProject())
        .on('error', ()=> {
            process.exit(1)
        })
        .pipe(sourceMaps.write('../maps'))
        .pipe(gulp.dest('build/local'));
});
