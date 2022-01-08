#!/usr/bin/env node
// ↑ nodeで実行するために必要

// これでエラーになった時tsファイルのどこでエラーになったかがわかりやすく表示される。
import * as sourceMapSupport from "source-map-support"
sourceMapSupport.install();

console.log("Hello world!");
