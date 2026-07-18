# Ticket: Consolidate Indicator DOM

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

2: indicatorへDOM責務を集める

## 目的

indicatorだけが使うDOM設定をindicator moduleへ集め、生成、表示、非表示、更新を直接テストする。

## 参照資料

- Grand Order: `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `indicator.js`, `test/core.test.mjs`
- 型契約: `types/globals.d.ts`

## 前提

- 選択除外設定はindicator生成時に1回だけ適用する。
- indicator表示の判定対象は、ページ内の同名IDではなく生成したelement自身である。
- `Element.remove()` は接続中でも未接続でも呼び出せる。

## 対象範囲

- `extension/core.js`
- `extension/indicator.js`
- `test/core.test.mjs`
- `test/indicator.test.mjs`
- `types/globals.d.ts`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- indicatorの見た目変更
- 表示位置変更
- content scriptの更新条件変更
- CSS file追加

## 実行内容

- 選択除外属性とstyleをindicator生成処理へ移す。
- coreの選択除外関数と公開型を削除する。
- `isConnected` で二重追加を防ぐ。
- `remove()` で非表示にする。
- indicator APIを直接テストする。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] indicator固有のDOM設定がcoreにない
- [x] 生成時の属性、style、初期文字がテストされる
- [x] 同じelementを二重追加しない
- [x] 非表示と再表示がテストされる
- [x] 型検査とテストが通る

## 検証方法

- `rg -n "keepIndicatorOutOfPageSelection|IndicatorSelectionElement" extension test types`
- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- indicatorの選択除外属性とstyleを `create` へ移した。
- coreの選択除外関数と型を削除した。
- `show` は対象elementの `isConnected` で二重追加を防ぐようにした。
- `hide` は `Element.remove()` を使うようにした。
- indicator APIを直接評価するNode標準テストを追加した。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/2-consolidate-indicator-dom/0-ticket-consolidate-indicator-dom.md`
- `extension/core.js`
- `extension/indicator.js`
- `test/core.test.mjs`
- `test/indicator.test.mjs`
- `types/globals.d.ts`

## 検証結果

### 実行したコマンド

- `rg -n "keepIndicatorOutOfPageSelection|IndicatorSelectionElement" extension test types`
- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- indicator固有の選択除外処理はcoreと型宣言からなくなった。
- `npm run typecheck` は成功した。
- Node標準テストは28件成功した。

## 完了条件の確認

- [x] indicator固有のDOM設定がcoreにない
- [x] 生成時の属性、style、初期文字がテストされる
- [x] 同じelementを二重追加しない
- [x] 非表示と再表示がテストされる
- [x] 型検査とテストが通る

## 未完了事項

- なし。
