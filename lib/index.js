// const { src, dest, parallel, series, watch } = require('gulp')

// const {
//   src
// } = require("gulp")

// const del = require('del')
// const browserSync = require('browser-sync')

// const loadPlugins = require('gulp-load-plugins')

// const plugins = loadPlugins()
// const bs = browserSync.create()

// const clean = () => {
//   return del(['dist', 'temp'])
// }

// const style = () => {
//   return src('src/assets/styles/*.scss', { base: 'src' })
//     .pipe(plugins.sass({ outputStyle: 'expanded' }))
//     .pipe(dest('temp'))
//     .pipe(bs.reload({ stream: true }))
// }

// const script = () => {
//   return src('src/assets/scripts/*.js', { base: 'src' })
//     .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
//     .pipe(dest('temp'))
//     .pipe(bs.reload({ stream: true }))
// }

// const page = () => {
//   return src('src/*.html', { base: 'src' })
//     .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
//     .pipe(dest('temp'))
//     .pipe(bs.reload({ stream: true }))
// }

// const image = () => {
//   return src('src/assets/images/**', { base: 'src' })
//     .pipe(plugins.imagemin())
//     .pipe(dest('dist'))
// }

// const font = () => {
//   return src('src/assets/fonts/**', { base: 'src' })
//     .pipe(plugins.imagemin())
//     .pipe(dest('dist'))
// }

// const extra = () => {
//   return src('public/**', { base: 'public' })
//     .pipe(dest('dist'))
// }

// const serve = () => {
//   watch('src/assets/styles/*.scss', style)
//   watch('src/assets/scripts/*.js', script)
//   watch('src/*.html', page)
//   // watch('src/assets/images/**', image)
//   // watch('src/assets/fonts/**', font)
//   // watch('public/**', extra)
//   watch([
//     'src/assets/images/**',
//     'src/assets/fonts/**',
//     'public/**'
//   ], bs.reload)

//   bs.init({
//     notify: false,
//     port: 2080,
//     // open: false,
//     // files: 'dist/**',
//     server: {
//       baseDir: ['temp', 'src', 'public'],
//       routes: {
//         '/node_modules': 'node_modules'
//       }
//     }
//   })
// }

// const useref = () => {
//   return src('temp/*.html', { base: 'temp' })
//     .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
//     // html js css
//     .pipe(plugins.if(/\.js$/, plugins.uglify()))
//     .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
//     .pipe(plugins.if(/\.html$/, plugins.htmlmin({
//       collapseWhitespace: true,
//       minifyCSS: true,
//       minifyJS: true
//     })))
//     .pipe(dest('dist'))
// }

// const compile = parallel(style, script, page)

// // 上线之前执行的任务
// const build =  series(
//   clean,
//   parallel(
//     series(compile, useref),
//     image,
//     font,
//     extra
//   )
// )

// const develop = series(compile, serve)

// module.exports = {
//   clean,
//   build,
//   develop
// }

const {
  src,
  dest,
  parallel,
  series,
  watch,
} = require("gulp");
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();
const del = require("del");
const browserSync = require("browser-sync");
const bs = browserSync.create();

const cwd = process.cwd();
console.log(111, cwd);
let config = {
  // default config
  build: {
    src: "src",
    dist: "dist",
    temp: "temp",
    public: "public",
    paths: {
      styles: "assets/styles/*.scss",
      scripts: "assets/scripts/*.js",
      pages: "*.html",
      images: "assets/images/**",
      fonts: "assets/fonts/**",
    },
  },
};
try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig);
} catch (e) {}

const clean = () => {
  return del([config.build.dist, config.build.temp]);
};

const style = () => {
  return src(config.build.paths.styles, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.sass({
      outputStyle: "expanded",
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true,
    }));
};

const script = () => {
  return src(config.build.paths.scripts, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.babel({
      presets: [require("@babel/preset-env")],
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true,
    }));
};

const page = () => {
  return src(config.build.paths.pages, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.swig({
      data: config.data,
      defaults: {
        cache: false,
      },
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true,
    }));
};

const image = () => {
  return src(config.build.paths.images, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));
};

const font = () => {
  return src(config.build.paths.fonts, {
      base: config.build.src,
      cwd: config.build.src,
    })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));
};

const extra = () => {
  return src("public/**", {
      base: "public",
    })
    .pipe(dest(config.build.dist));
};

const server = () => {
  watch(config.build.paths.styles, {
    cwd: config.build.src,
  }, style);
  watch(config.build.paths.scripts, {
    cwd: config.build.src,
  }, script);
  watch(config.build.paths.pages, {
    cwd: config.build.src,
  }, page);
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  watch([
    config.build.paths.images,
    config.build.paths.fonts,
  ], {
    cwd: config.build.src,
  }, bs.reload());
  watch("**", {
    cwd: config.build.public
  }, bs.reload);
  bs.init({
    notify: false,
    port: 2080,
    open: true,
    // files: 'dist/**',
    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const useref = () => {
  return src("temp/*.html", {
      base: "temp",
    })
    .pipe(plugins.useref({
      searchPath: ["temp", "."],
    }))
    .pipe(plugins.if(/.js$/, plugins.uglify()))
    .pipe(plugins.if(/.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    })))
    .pipe(dest(config.build.dist));
};

const compile = parallel(style, script, page);
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra,
  ),
);
const develop = series(compile, server);
module.exports = {
  clean,
  build,
  develop,
};
