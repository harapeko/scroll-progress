# Ticket: Split Badge

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

15: badge操作をservice worker本体から分ける

## 目的

service worker本体からbadge表示操作を分ける。

## 参照資料

- 要求のSOT: ユーザー指示「コードのリファクタすすめて」
- 現在状態: `extension/background.js`
- 過去Ticket: Mission 14でcontent script名を整理済み。

## 前提

- `background.js` は拡張アイコンのクリック、content scriptへのmessage送信、badge操作を持っている。
- badge操作はクリック処理とは別責務。
- service workerでは `importScripts()` で追加scriptを読み込める。
- 挙動は変えない。

## 対象範囲

- `extension/badge.js`
- `extension/background.js`
- `scripts/build-zip.sh`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- content script
- manifest
- 追加ライブラリ
- 表示仕様変更

## 実行内容

- `extension/badge.js` を追加する。
- badgeの更新と消去を `badge.js` へ移す。
- `background.js` は `ScrollProgressBadge` を呼ぶ。
- build scriptのzip対象へ `badge.js` を追加する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] badge操作が `badge.js` に分かれている
- [x] `npm run verify` が通る
- [x] `extension.zip` に `badge.js` が含まれる
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

- `extension/badge.js` を追加した。
- `background.js` からbadge操作を移した。
- build scriptのzip対象へ `badge.js` を追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/15-split-badge/0-ticket-split-badge.md`
- `extension/background.js`
- `extension/badge.js`
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
- `extension.zip` に `badge.js` が含まれることを確認した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] badge操作が `badge.js` に分かれている
- [x] `npm run verify` が通る
- [x] `extension.zip` に `badge.js` が含まれる
- [x] 生成zipをコミットしない

## 未完了事項

- なし
