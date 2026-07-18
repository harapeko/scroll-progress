# Ticket: Remove Deprecated CSS Alias

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

7: 非推奨CSS aliasとVM警告を整理する

## 目的

非推奨のCSS aliasを削除し、VMから参照するtest stubの未使用警告を正しく扱う。

## 根拠

- TypeScriptの `lib.dom.d.ts` は `webkitUserSelect` を `userSelect` のlegacy aliasとして非推奨にしている。
- indicatorは標準の `userSelect` も同じ値で設定している。
- test stubのmethodは、`vm.runInContext` で実行するscriptから参照される。

## 対象範囲

- `extension/indicator.js`
- `test/indicator.test.mjs`
- `test/core.test.mjs`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- indicatorの表示仕様変更
- test stubの共通化
- TypeScript設定変更

## 実行内容

- `webkitUserSelect` の設定と期待値を削除する。
- VM経由で参照するtest objectへinspection指定を付ける。

## 完了条件

- [x] `webkitUserSelect` を使用しない
- [x] `userSelect: none` を維持する
- [x] VM stubの動的参照理由がコード上にある
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `rg -n "webkitUserSelect" extension test`
- `npm run typecheck`
- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。

## 実施内容

- indicatorから `webkitUserSelect` を削除し、標準の `userSelect` だけを残した。
- indicator testのstyle期待値を現在の実装へ合わせた。
- indicatorとcoreのVM stubへ、動的参照のinspection指定を付けた。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/7-remove-deprecated-css-alias/0-ticket-remove-deprecated-css-alias.md`
- `extension/indicator.js`
- `test/indicator.test.mjs`
- `test/core.test.mjs`

## 検証結果

- `webkitUserSelect` の検索結果は0件だった。
- 構文検査と型検査は成功した。
- Node標準テストは29件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 完了条件の確認

- [x] `webkitUserSelect` を使用しない
- [x] `userSelect: none` を維持する
- [x] VM stubの動的参照理由がコード上にある
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
