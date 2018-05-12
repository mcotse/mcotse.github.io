var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var flatmap = require('gulp-flatmap');
var converter = require('sass-convert');
var path = require('path');
var penthouse = require('penthouse');
var cleanCSS = require('gulp-clean-css');
var fs = require('fs');
var minify = require('gulp-minify');

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

gulp.task('serve-prod', ['sass'], function() {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
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
    url: 'http://mcotse.github.io',
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

gulp.task('pipe-index', function () {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('pipe-images', function () {
  return gulp.src(['assets/images/**/*'])
    .pipe(gulp.dest('dist/assets/images'));
});

// gulp.task('pipe-all-images', ['pipe-images'], function () {
//   return gulp.src('asssets/images/blurred/**/*')
//     .pipe(gulp.dest('dist/images/blurred'));
// });

gulp.task('minify-css', function () {
  return gulp.src('assets/stylesheets/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/assets/stylesheets'));
});

gulp.task('minify-js', function () {
  return gulp.src('assets/javascript/*.js')
    .pipe(minify({
      ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist/assets/javascript'));
});

gulp.task('build-prod', ['minify-css','minify-js','pipe-index','pipe-images'], function() {
  return;
});


gulp.task('default',['serve']);
