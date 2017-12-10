const {writeFileSync} = require('fs');
const gulp = require('gulp');

gulp.task('doStuff', function () {
    writeFileSync('executed', '')
});
