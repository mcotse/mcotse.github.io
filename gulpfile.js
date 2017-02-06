var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var flatmap = require('gulp-flatmap');
var converter = require('sass-convert');
var path = require('path');
var penthouse = require('penthouse');
var cleanCSS = require('gulp-clean-css');
var fs = require('fs');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('assets/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
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
  gulp.watch('assets/scss/**/*.scss',['sass']);
  gulp.watch('index.html').on('change',browserSync.reload)
  gulp.watch('assets/javascript/*.js').on('change',browserSync.reload)
});

//convert all sass to scss
gulp.task('convert', function(){
  return gulp.src('assets/sass/')
    .pipe(flatmap((stream, dir)=>
      gulp.src(dir.path + '/**/*.{scss,sass}')
        .pipe(converter({
          from: 'sass',
          to: 'scss',
          rename: true
        }))
        .pipe(gulp.dest('assets/scss/' + path.basename(dir.path)))
  ))
});

gulp.task('penthouse', function () {
  penthouse({
    url: 'http://matthewtse.xyz',
    css: 'assets/stylesheets/main.css',
    width: 1680,
    height: 1050,
    strict: false,
    blockJSRequests: true
  }, function (err, critical) {
    if (err) {
        throw err;
    }
    // var clean = new cleanCSS().minify(critical);
    fs.writeFileSync('assets/stylesheets/critical.css', critical);
  });
});

gulp.task('default',['serve']);
