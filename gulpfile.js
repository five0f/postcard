const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");

const {
  watch,
  series,
  parallel,
  task,
  src,
  dest
} = require("gulp");

const paths = {
  src: {
    root: "./src/**/*",
    html: "./src/*",
    css: "./src/css/*",
    js: "./src/js/*",
    images: "./src/images/*",
  },
  build: {
    allFiles: "./build/**",
    root: "./build/",
    js: "./build/js/",
    css: "./build/css/",
    images: "./build/images/"
  }
};

function rmBuild() {
  return src(paths.build.root, {
    read: false,
    allowEmpty: true
  })
    .pipe(clean());
};

function processRoot() {
  return src(paths.src.root)
    .pipe(dest(paths.build.root));
};

function processCss() {
  return src(paths.src.css)
    .pipe(concat("main.css"))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(dest(paths.build.css));
};

function processJs() {
  return src(paths.src.js)
    .pipe(dest(paths.build.js));
};

function processImages() {
  return src(paths.src.images)
    .pipe(dest(paths.build.images));
};

task("build", series(
  rmBuild,
  processRoot,
  processCss,
  processJs,
  processImages
));

function watchSrc() {
  watch(paths.src.root, series("build"));
};

function runHotReload() {
  browserSync.init({
    server: {
      baseDir: paths.build.root
    }
  });

  watch(paths.build.allFiles, browserSync.reload);
};

task("default", series("build", parallel(watchSrc, runHotReload)));
