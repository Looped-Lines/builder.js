import gulp = require('gulp')
import {run} from './source/helpers/run';

gulp.task('pre-push', ['test']);

gulp.task('test', () => {
    return run('./node_modules/mocha/bin/mocha', 'source/**/*UnitTest.ts --require ts-node/register');
});

