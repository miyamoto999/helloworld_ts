# gulpとTypeScriptとVSCodeで開発環境を用意してみた。(testを追加)

↓このエントリにtestを追加してみた。

[gulpとTypeScriptとVSCodeで開発環境を用意してみた。](https://m-miya.blog.jp/archives/1079312924.html)


まず、モジュールをインストールする。

~~~bash
$ npm install @types/mocha gulp-mocha mocha ts-node --save-dev
~~~

- mocha:テストフレームワーク
- gulp-mocha:gulpでmochaを実行するためのプラグイン
- ts-node:TypeScriptを実行するためのプラグイン

"Hello world!"表示するだけのプログラムだとやりにくいんでテスト対象のコードを追加する。

src/hoge.ts
~~~typescript
export class Hoge {
    public message: string;

    public constructor() {
        this.message = "Hello world!";
    }
}
~~~

次にテストプログラムをtestフォルダに作る。

test/test001.ts
~~~typescript
import {Hoge} from "../src/hoge";
import * as assert from "assert";

describe("test001", () => {
    // Hogeクラスのインスタンスを生成するテスト
    it("hoge", () => {
        const hoge = new Hoge();
        assert.equal(hoge.message, "Hello world!");
    });
    // ためしにエラーの場合もためしに用意しておく。
    it("error", ()=>{
        assert.fail();
    });
});
~~~

ためしにコマンドラインでmochaを実行してみる。

~~~bash
$ npx mocha -r ts-node/register test/**/*.ts


  test001
    ✔ hoge
    1) error


  1 passing (34ms)
  1 failing

  1) test001
       error:
     AssertionError [ERR_ASSERTION]: Failed
      at Context.<anonymous> (test/test001.ts:12:16)
      at processImmediate (node:internal/timers:464:21)
~~~

2つ目はわざとエラーになるようにしたのでこれで成功。

gulpfile.jsにテストタスクを追加する。

gulpfile.js
~~~javascript
...(省略)
const mocha = require("gulp-mocha");
...(省略)

// テストファイルを指定する。
const testFiles = "test/**/*.ts";

...(省略)
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
...(省略)
// テストを実行
exports.test = series(testTask);
...(省略)
~~~

これで次のコマンドを実行するとテストが実行される。

~~~bash
$ npx gulp test
~~~

"package.json"の"scripts"に"test"を追加すると"npm test"でテストが実行できるようにもなる。

~~~json
  ...(省略)
  
  "scripts": {
    ...(省略)

    "test": "npx gulp test"
  },

  ...(省略)
~~~

watchタスクまわりを調整する。ソースファイルが更新されたらビルドとテストを実行するようにする。コマンド類も変更する。defalutはビルドとテスト、watchでwatchタスクを起動するようにしておく。

gulpfile.js
~~~javascript
...(省略)

// ウォッチタスク
const watchTask = () => {
    watch(srcFiles, series(buildTask, testTask));
    watch(testFiles, series(testTask));
}

...(省略)

// npx gulp buildでビルド
exports.build = series(buildTask);
// テストを実行
exports.test = series(testTask);
// npx gulpでソースの変更を監視してビルドとテスト
exports.watch = series(watchTask);
// デフォルトはビルドとテスト
exports.default = series(buildTask, testTask);
~~~

[github](https://github.com/miyamoto999/helloworld_ts)にコードを投稿しておいた。(エラーになるのをあけるのもなんだんでエラーにならないようにしてある(^^;))
