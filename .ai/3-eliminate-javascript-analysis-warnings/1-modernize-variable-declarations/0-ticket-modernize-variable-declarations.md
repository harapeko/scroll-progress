# Ticket: Modernize Variable Declarations

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

3: Eliminate JavaScript Analysis Warnings

## 対象Mission

1: `var` を `const` と `let` へ置き換える

## 目的

extensionコードの変数宣言を、再代入の有無に合った宣言へ変更する。

## 参照資料

- 要求のSOT: ユーザーから提示されたWebStorm警告
- Grand Order: `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- 現在状態: `extension/*.js`

## 前提

- Manifest V3の対象Chromeは `const` と `let` を実行できる。
- extensionコードはIIFE内にあり、block scopeへの変更でscript間の公開方法は変わらない。
- 再代入するのは表示状態とthrottle内部状態だけ。

## 対象範囲

- `extension/background.js`
- `extension/badge.js`
- `extension/content.js`
- `extension/core.js`
- `extension/indicator.js`
- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 型検査設定
- package依存関係
- global APIの型宣言
- 機能変更

## 実行内容

- 再代入しない `var` を `const` へ置き換える。
- 再代入する `var` を `let` へ置き換える。
- extensionコードに `var` が残っていないことを確認する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- manifest
- package依存関係

## 完了条件

- [x] `extension/` 配下に `var` が残っていない
- [x] 構文検査と既存テストが通る
- [x] package生成が成功する
- [x] 生成zipをコミットしない

## 検証方法

- `rg -n "\\bvar\\b" extension -g '*.js'`
- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- extensionコードの `var` を `const` または `let` へ置き換えた。
- 再代入する `enabled`, `timeout`, `previous` だけ `let` とした。

## 変更ファイル

- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- `.ai/3-eliminate-javascript-analysis-warnings/1-modernize-variable-declarations/0-ticket-modernize-variable-declarations.md`
- `extension/background.js`
- `extension/badge.js`
- `extension/content.js`
- `extension/core.js`
- `extension/indicator.js`

## 検証結果

### 実行したコマンド

- `rg -n "\\bvar\\b" extension -g '*.js'`
- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- extensionコードの `var` は0件だった。
- `npm run verify` は成功した。
- Node標準テストは22件成功した。
- 生成zipは削除済み。

## 完了条件の確認

- [x] `extension/` 配下に `var` が残っていない
- [x] 構文検査と既存テストが通る
- [x] package生成が成功する
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
