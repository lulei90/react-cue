var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var cssgrace = require('cssgrace');

var lib={
    src:'lib',
    dist:'lib'
};
//css 处理压缩 屏蔽有问题的css
gulp.task('cssmin', function () {
    var processors = [cssgrace];
    return gulp.src(lib.src+'/*.less')
        .pipe($.less())
        .pipe($.postcss(processors))
        .pipe($.autoprefixer({ browsers: ['> 1%', 'last 10 versions'], cascade: false }))
        .pipe(gulp.dest(lib.dist))
});
gulp.task('default',gulp.series('cssmin'));
