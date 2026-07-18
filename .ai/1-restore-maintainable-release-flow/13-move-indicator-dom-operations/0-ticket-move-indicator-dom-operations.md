# Ticket: Move Indicator DOM Operations

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

13: 進捗表示DOM操作をindicatorへ寄せる

## 目的

`scroll_progress.js` から進捗表示要素のDOM操作を減らし、表示要素の責務を `indicator.js` に集める。

## 参照資料

- 要求のSOT: ユーザー指示「コードのリファクタすすめて」
- 現在状態: `extension/indicator.js`, `extension/scroll_progress.js`
- 過去Ticket: Mission 12で表示要素の生成を `indicator.js` へ分離済み。

## 前提

- `scroll_progress.js` は現在も `document.body.appendChild`, `parentNode.removeChild`, `textContent` を直接扱っている。
- 表示要素のDOM操作は、スクロール進捗の状態管理とは別責務。
- 表示仕様は変えない。

## 対象範囲

- `extension/indicator.js`
- `extension/scroll_progress.js`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 表示デザイン変更
- manifest変更
- build script変更
- 追加ライブラリ

## 実行内容

- `indicator.js` に `show`, `hide`, `update` を追加する。
- `scroll_progress.js` から直接のappend/remove/text更新を外す。
- `scroll_progress.js` は進捗計算結果をindicatorへ渡すだけにする。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] `scroll_progress.js` が表示要素のappend/remove/text更新を直接行わない
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

- `indicator.js` に `show`, `hide`, `update` を追加した。
- `scroll_progress.js` はindicator APIを呼ぶ形へ変更した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/13-move-indicator-dom-operations/0-ticket-move-indicator-dom-operations.md`
- `extension/indicator.js`
- `extension/scroll_progress.js`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] `scroll_progress.js` が表示要素のappend/remove/text更新を直接行わない
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし
