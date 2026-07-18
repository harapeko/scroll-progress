# Ticket: Refactor Scroll Progress Core

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

2: スクロール進捗ロジックをテスト可能に整理する

## 目的

既存の表示仕様を変えずに、スクロール進捗計算をテスト可能な形へ分ける。

## 参照資料

- 要求のSOT: ユーザー指示「ここまでの活かせた作業をこちらでも実行」
- 現在状態: `scroll_progress/scroll_progress.js`, `scroll_progress/manifest.json`

## 前提

- manifestはすでにV3。
- content scriptはページ上で自動実行される。
- 現在コードはunderscore由来の汎用関数コピーとDOM処理が1ファイルに混在している。
- `activeTab` 権限は現在コードで使っていない。

## 対象範囲

- `scroll_progress/core.js`
- `scroll_progress/scroll_progress.js`
- `scroll_progress/manifest.json`
- `test/core.test.mjs`
- `package.json`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 表示デザイン変更
- 対応サイト拡大
- Chrome Web Store release workflow
- 外部ライブラリ追加

## 実行内容

- 進捗計算と実行判定を `core.js` に分ける。
- DOM表示とイベント登録を `scroll_progress.js` に残す。
- 進捗計算のNode標準テストを追加する。
- 未使用の `activeTab` 権限を削除する。

## 変更してよい範囲

- `scroll_progress/core.js`
- `scroll_progress/scroll_progress.js`
- `scroll_progress/manifest.json`
- `test/core.test.mjs`
- `package.json`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/2-refactor-scroll-progress-core/0-ticket-refactor-scroll-progress-core.md`

## 変更してはいけない範囲

- `images/`
- `scroll_progress/icons/`
- README
- 生成zip

## 完了条件

- [x] 進捗計算がテストできる
- [x] content scriptが既存と同じIDで表示を作る
- [x] 未使用の `activeTab` 権限がない
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run verify`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `scroll_progress/core.js` を追加した。
- 進捗計算、body overflow判定、throttleをcoreへ分けた。
- `scroll_progress/scroll_progress.js` をDOM表示とイベント登録に絞った。
- manifestのcontent script読み込み順を `core.js`, `scroll_progress.js` に変更した。
- 未使用の `activeTab` 権限を削除した。
- Node標準テストを追加した。
- `npm run verify` に `npm run test` を追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/2-refactor-scroll-progress-core/0-ticket-refactor-scroll-progress-core.md`
- `package.json`
- `scroll_progress/core.js`
- `scroll_progress/manifest.json`
- `scroll_progress/scroll_progress.js`
- `test/core.test.js`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- `npm run clean` は成功した。
- `scroll_progress.zip` が削除されていることを確認した。
- 空白確認に成功した。

## 完了条件の確認

- [x] 進捗計算がテストできる
- [x] content scriptが既存と同じIDで表示を作る
- [x] 未使用の `activeTab` 権限がない
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- Chromeでの手動ロード確認は未実施。

## 発見した問題

- 現在のREADMEのChrome Web Storeリンクは古い形式のまま。

## Ticket外として見送った事項

- Chrome Web Store release workflow。
