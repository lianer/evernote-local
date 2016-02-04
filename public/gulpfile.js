var gulp=require("gulp");
var scss=require("gulp-sass");
var cssmin=require("gulp-cssmin");
var plumber=require("gulp-plumber");
var gutil=require("gulp-util");
var livereload=require("gulp-livereload");


var errorHandler=function (e){
    gutil.beep();
    gutil.log(e);
};


gulp.task("build", function () {
    gulp.src(["scss/*.scss"])
        .pipe(scss())
        .pipe(cssmin())
        .pipe(gulp.dest("css"));

    gulp.src(["scss/*.css"])
        .pipe(gulp.dest("css"));
});


gulp.task("watch", function () {
    livereload.listen();

    gulp.watch(["scss/*.scss"], function (file) {
        gulp.src([file.path])
            .pipe(plumber({errorHandler: errorHandler}))
            .pipe(scss())
            .pipe(gulp.dest("css"));
    });

    gulp.watch(["css/*.css", "js/*.js", "view/*.php"]).on('change', livereload.changed);
});

gulp.task("default", ["build", "watch"]);


