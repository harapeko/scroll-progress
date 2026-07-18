# Ticket: Badge Display Contract

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

2: Stabilize Extension Module Boundaries

## 対象Mission

2: badge表示の判断をテスト可能にする

## 目的

badgeに表示する文字の判断をpure functionとして固定する。

## 参照資料

- 要求のSOT: ユーザー指示「go」
- Grand Order: `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- 現在状態: `extension/badge.js`, `extension/core.js`, `test/core.test.mjs`

## 前提

- 現在のbadge表示は、ONなら空文字、OFFなら `OFF`。
- `badge.js` はChrome API adapterとして薄く保ちたい。
- 表示文字の判断はChrome APIなしでテストできる。

## 対象範囲

- `extension/core.js`
- `extension/badge.js`
- `test/core.test.mjs`
- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- このTicket

## 対象外

- badgeの表示文字変更
- badge色変更
- message契約変更
- manifest変更

## 実行内容

- `core.js` に `getBadgeText()` を追加する。
- `badge.js` は `getBadgeText()` の結果をChrome APIへ渡す。
- Node標準テストでON/OFF時のbadge文字を固定する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] badge表示文字の判断が `core.js` にある
- [x] `OFF` 表示条件がテストされている
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

- `core.js` に `getBadgeText()` を追加した。
- `badge.js` は `getBadgeText()` を使ってbadge文字を設定するようにした。
- Node標準テストを追加した。

## 変更ファイル

- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- `.ai/2-stabilize-extension-module-boundaries/2-badge-display-contract/0-ticket-badge-display-contract.md`
- `extension/badge.js`
- `extension/core.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは13件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] badge表示文字の判断が `core.js` にある
- [x] `OFF` 表示条件がテストされている
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
