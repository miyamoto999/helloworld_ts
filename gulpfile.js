const { dest, src, series, watch, parallel } = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sourcemaps = require("gulp-sourcemaps");
const mocha = require("gulp-mocha");

// tsファイルを指定する。
const srcFiles = "src/**/*.ts";
// 出力先を指定する。
const destDir = "dist";
// テストファイルを指定する。
const testFiles = "test/**/*.ts";

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
    watch(srcFiles, series(buildTask, testTask));
    watch(testFiles, series(testTask));
}

// テストタスク
const testTask = (done) => {
    src(testFiles)
        .pipe(mocha({
            require: ["ts-node/register"],
            reporter: "list",
            exit: true
        }))
        .on("error", (err) => {
            console.error(err);
        })
    done();
}

// npx gulp buildでビルド
exports.build = series(buildTask);
// テストを実行
exports.test = series(testTask);
// npx gulpでソースの変更を監視してビルドとテスト
exports.watch = series(watchTask);
// デフォルトはビルドとテスト
exports.default = series(buildTask, testTask);
