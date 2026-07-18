# Ticket: Split Indicator

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

12: 進捗表示要素の生成責務を分ける

## 目的

content script本体から、進捗表示要素のDOM生成責務を分ける。

## 参照資料

- 要求のSOT: ユーザー指示「コードのリファクタをすすめて」
- 現在状態: `extension/scroll_progress.js`, `extension/core.js`, `extension/manifest.json`

## 前提

- `scroll_progress.js` は、DOM生成、表示状態、スクロール更新、message受信を持っている。
- 表示要素の作り方はスクロール更新とは別責務。
- manifestのcontent script読み込み順を保てば、buildなしでファイル分割できる。

## 対象範囲

- `extension/indicator.js`
- `extension/scroll_progress.js`
- `extension/manifest.json`
- `scripts/build-zip.sh`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 表示デザインの変更
- スクロール計算ロジックの変更
- ON/OFF挙動の変更
- 追加ライブラリ

## 実行内容

- `extension/indicator.js` を追加する。
- 進捗表示要素の生成処理を `indicator.js` へ移す。
- `scroll_progress.js` は `ScrollProgressIndicator.create()` を使う。
- manifestのcontent scriptへ `indicator.js` を追加する。
- zip生成対象へ `indicator.js` を追加する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] DOM生成責務が `indicator.js` に分かれている
- [x] `npm run verify` が通る
- [x] `extension.zip` に `indicator.js` が含まれる
- [x] 生成zipをコミットしない

## 検証方法

- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `extension/indicator.js` を追加した。
- `scroll_progress.js` から表示要素の生成処理を移した。
- manifestとbuild scriptへ `indicator.js` を追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/12-split-indicator/0-ticket-split-indicator.md`
- `extension/indicator.js`
- `extension/manifest.json`
- `extension/scroll_progress.js`
- `scripts/build-zip.sh`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- `extension.zip` に `indicator.js` が含まれることを確認した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] DOM生成責務が `indicator.js` に分かれている
- [x] `npm run verify` が通る
- [x] `extension.zip` に `indicator.js` が含まれる
- [x] 生成zipをコミットしない

## 未完了事項

- なし
