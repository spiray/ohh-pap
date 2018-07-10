const gulp = require(`gulp`),
    imagemin = require(`gulp-imagemin`),
    cleanCSS = require(`gulp-clean-css`),
    minify = require(`gulp-minify`),
    rename = require(`gulp-rename`),
    concat = require(`gulp-concat`);

const paths = {
    images: `./public/images/*`,
    scripts: `./public/js/*.js`,
    styles: `./public/css/*.css`,
    data: `./public/data/*.csv`,
    docs: `./public/docs/*/*`
};

const dests = {
    images: `dist/public/images`,
    scripts: `dist/public/js`,
    styles: `dist/public/css`,
    data: `dist/public/data`,
    docs: `dist/public/docs/`
};

gulp.task(`default`, [`images`, `minify-css`, `minify-js`, `data`, `docs`]);

gulp.task(`images`, () => gulp.src(paths.images)
    .pipe(imagemin({
        optimizationLevel: 5
    }))
    .pipe(gulp.dest(dests.images)));

gulp.task(`minify-css`, () => gulp.src(paths.styles)
    .pipe(cleanCSS())
    .pipe(rename(`style.min.css`))
    .pipe(gulp.dest(dests.styles)));

gulp.task(`minify-js`, () => gulp.src(paths.scripts)
    .pipe(minify({
        ext: {
            min: `.min.js`
        },
        noSource: `*`,
        exclude: [`mainFunc.js`]
    }))
    .pipe(concat(`all.min.js`))
    .pipe(gulp.dest(dests.scripts)));

gulp.task(`docs`, () => gulp.src(paths.docs)
    .pipe(gulp.dest(dests.docs)));

gulp.task(`data`, () => gulp.src(paths.data)
    .pipe(gulp.dest(dests.data)));