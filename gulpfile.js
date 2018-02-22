let gulp = require('gulp');
let imagemin = require('gulp-imagemin');

const paths = {
    images: './public/images/**/*',
    scripts: './public/js/**/*',
    styles: './public/css/**/*'
};

gulp.task('default', ['images']);

gulp.task('images', () => {
    return gulp.src(paths.images)
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest('dist/public/images'));
})