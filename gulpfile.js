const { dest, src, series, watch, parallel } = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sourcemaps = require("gulp-sourcemaps");

// tsファイルを指定する。
const srcFiles = "src/**/*.ts";
// 出力先を指定する。
const destDir = "dist";

// ビルドタスク
const buildTask = (done) => {
    src(srcFiles)
        .pipe(sourcemaps.init())    // soucemapを出力する準備
        .pipe(tsProject())          // tsconfig.jsonを使用してビルド
        .on("error", (err) => {
            console.error(err);
        })
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: '../src' }))   // sourcemapを出力する。
        .pipe(dest(destDir));       // 出力先を指定する。
    done();
}

// ウォッチタスク
const watchTask = () => {
    watch(srcFiles, series(buildTask));
}

// npx gulp buildでビルド
exports.build = series(buildTask);
// npx gulpでソースの変更を監視してビルド
exports.default = series(watchTask);
