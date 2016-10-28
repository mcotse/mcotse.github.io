var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('assets/sass/main.sass')
    .pipe(sass())
    .pipe(gulp.dest('assets/stylesheets'))
    .pipe(browserSync.stream());
});

// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('assets/sass/**/*.sass',['sass']);
  gulp.watch('index.html').on('change',browserSync.reload)
});

gulp.task('watch', function(){
  gulp.watch('assets/sass/**/*.sass').on("change",['sass']);
  gulp.watch('assets/javascript/*.js',[reload]);
});

gulp.task('default',['serve']);
