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
        // assert.fail();
        assert.ok(true);
    });
});