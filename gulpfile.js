const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const imagemin = require('gulp-imagemin');

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
    rootOnly: "./src/*",
    css: "./src/css/main.css",
    fonts: "./src/fonts/*.ttf",
    lib: "./src/lib/**/*",
    js: "./src/js/*.js",
    images: "./src/images/**/*.{jpg,jpeg,png,svg}",
  },
  build: {
    allFiles: "./build/**/*",
    root: "./build/",
    css: "./build/css/",
    fonts: "./build/fonts/",
    lib: "./build/lib/",
    js: "./build/js/",
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
  return src(paths.src.rootOnly)
    .pipe(dest(paths.build.root));
};

function processCss() {
  return src(paths.src.css)
    .pipe(autoprefixer())
    .pipe(dest(paths.build.css));
};

function processFonts() {
  return src(paths.src.fonts)
    .pipe(dest(paths.build.fonts));
};

function processJs() {
  return src(paths.src.js)
    .pipe(dest(paths.build.js));
};

function processLib() {
  return src(paths.src.lib)
    .pipe(dest(paths.build.lib));
}

function processImages() {
  return src(paths.src.images)
    .pipe(imagemin())
    .pipe(dest(paths.build.images));
};

task("build", series(
  rmBuild,
  processRoot,
  processCss,
  processFonts,
  processJs,
  processLib,
  processImages
));

function watchSrc() {
  watch(paths.src.root, processRoot);
  watch(paths.src.css, processCss);
  watch(paths.src.fonts, processFonts);
  watch(paths.src.js, processJs);
  watch(paths.src.lib, processLib);
  watch(paths.src.images, processImages);
};

function hotReload(done) {
  browserSync.reload();
  done();
}

function runHotReloading() {
  browserSync.init({
    server: {
      baseDir: paths.build.root
    }
  });

  watch(paths.build.allFiles, hotReload);
};

task("default", series("build", parallel(watchSrc, runHotReloading)));
