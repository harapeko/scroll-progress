# Ticket: Use Scrolling Element Metrics

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

4: Strengthen Core Runtime Behavior

## 対象Mission

1: スクロール主体の寸法で進捗を計算する

## 目的

スクロール位置と全体高を同じelementから取得し、一般的なdocumentスクロール構成で進捗計算を一貫させる。

## 参照資料

- CSSOM View: <https://drafts.csswg.org/cssom-view/#dom-document-scrollingelement>
- CSSOM View: <https://drafts.csswg.org/cssom-view/#dom-element-scrollheight>
- Grand Order: `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `test/core.test.mjs`, `types/globals.d.ts`

## 前提

- `Document.scrollingElement` はviewportのスクロールに使うelementを返す。
- `Element.scrollTop` と `Element.scrollHeight` は同じelementから取得できる。
- `scrollingElement` がnullの場合は、現在どおり `documentElement` を使う。

## 対象範囲

- `extension/core.js`
- `test/core.test.mjs`
- `types/globals.d.ts`
- `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- このTicket

## 対象外

- viewport高の取得方法変更
- body overflow判定の変更
- throttle変更
- 公開API変更

## 実行内容

- `scrollingElement` またはfallback先から `scrollTop` と `scrollHeight` を読む。
- `||` をnullish fallbackの意図が明確な `??` へ変更する。
- JSDocと型宣言を実際に読むプロパティへ合わせる。
- scrolling elementとfallbackのテストを更新する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] `scrollTop` と `scrollHeight` が同じelementから読まれる
- [x] `scrollingElement` がnullでも計算できる
- [x] bodyの寸法に依存しない
- [x] 型検査とテストが通る

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `scrollingElement` の `scrollTop` と `scrollHeight` を進捗計算へ渡すようにした。
- `scrollingElement` がnullの場合は `documentElement` の位置と高さを使うようにした。
- JSDocとglobal型宣言から不要になったbody依存を外した。
- 2つのelementで異なる高さを使うfixtureへ更新した。

## 変更ファイル

- `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- `.ai/4-strengthen-core-runtime-behavior/1-use-scrolling-element-metrics/0-ticket-use-scrolling-element-metrics.md`
- `extension/core.js`
- `test/core.test.mjs`
- `types/globals.d.ts`

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run typecheck` は成功した。
- Node標準テストは25件成功した。
- `scrollingElement` とfallbackの両方をテストした。

## 完了条件の確認

- [x] `scrollTop` と `scrollHeight` が同じelementから読まれる
- [x] `scrollingElement` がnullでも計算できる
- [x] bodyの寸法に依存しない
- [x] 型検査とテストが通る

## 未完了事項

- なし。
