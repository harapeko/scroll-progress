# Ticket: Move Document Progress

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

16: documentからの進捗計算をcoreへ寄せる

## 目的

content scriptから、document/windowの値を使ってスクロール率を作る処理を分ける。

## 参照資料

- 要求のSOT: ユーザー指示「コードのリファクタすすめて」
- 現在状態: `extension/content.js`, `extension/core.js`, `test/core.test.mjs`

## 前提

- `content.js` は現在、DOMから `scrollTop`, `scrollHeight`, `innerHeight` を取得して `calculateProgress()` に渡している。
- 進捗計算に必要な値の取り方はテスト対象にできる。
- 表示仕様は変えない。

## 対象範囲

- `extension/core.js`
- `extension/content.js`
- `test/core.test.mjs`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 表示DOM操作
- manifest
- build script
- 追加ライブラリ

## 実行内容

- `core.js` に `calculateDocumentProgress()` を追加する。
- `content.js` は `calculateDocumentProgress(document, window)` を呼ぶ形にする。
- Node標準テストで `scrollingElement` と `documentElement` fallbackを確認する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] `content.js` から進捗計算用のDOM値取得が減っている
- [x] `calculateDocumentProgress()` がテストされている
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

- `core.js` に `calculateDocumentProgress()` を追加した。
- `content.js` は `calculateDocumentProgress(document, window)` を呼ぶ形にした。
- Node標準テストを追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/16-move-document-progress/0-ticket-move-document-progress.md`
- `extension/content.js`
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
- Node標準テストは9件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] `content.js` から進捗計算用のDOM値取得が減っている
- [x] `calculateDocumentProgress()` がテストされている
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし
