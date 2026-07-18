# Ticket: Indicator Display Text

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

2: Stabilize Extension Module Boundaries

## 対象Mission

3: indicator表示文字の生成をテスト可能にする

## 目的

indicatorに表示する文字の生成をpure functionとして固定する。

## 参照資料

- 要求のSOT: ユーザー指示「go」
- Grand Order: `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- 現在状態: `extension/indicator.js`, `extension/core.js`, `test/core.test.mjs`

## 前提

- 現在の表示は、整数の進捗値と半角空白を挟んだ `%`。
- 初期表示と更新時の表示形式は同じ。
- `indicator.js` はDOM操作に絞りたい。

## 対象範囲

- `extension/core.js`
- `extension/indicator.js`
- `test/core.test.mjs`
- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 進捗計算の変更
- indicatorの見た目や表示位置の変更
- message契約変更
- manifest変更

## 実行内容

- `core.js` にindicator表示文字を作る関数を追加する。
- `indicator.js` の初期表示と更新処理からその関数を使う。
- Node標準テストで表示形式を固定する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] indicator表示文字の生成が `core.js` にある
- [x] 初期値、途中値、最大値の表示形式がテストされている
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `core.js` に `getIndicatorText()` を追加した。
- `indicator.js` の初期表示と更新処理で同じ関数を使うようにした。
- Node標準テストで `0 %`, `37 %`, `100 %` を確認した。

## 変更ファイル

- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- `.ai/2-stabilize-extension-module-boundaries/3-indicator-display-text/0-ticket-indicator-display-text.md`
- `extension/core.js`
- `extension/indicator.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは14件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] indicator表示文字の生成が `core.js` にある
- [x] 初期値、途中値、最大値の表示形式がテストされている
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
