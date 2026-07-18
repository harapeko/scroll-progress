# Ticket: Content Script Startup

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

2: Stabilize Extension Module Boundaries

## 対象Mission

4: content scriptの起動処理を整理する

## 目的

content scriptの起動条件、listener登録、状態更新の流れを読み取りやすくする。

## 参照資料

- 要求のSOT: ユーザー指示「go」
- Grand Order: `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- 現在状態: `extension/content.js`, `extension/core.js`, `extension/indicator.js`

## 前提

- 対応ページでは、初期表示後にloadとscrollを監視する。
- action clickのtoggle要求は、表示状態をタブ内だけで反転する。
- `body` の `overflowY` が `auto` のページは既存仕様どおり対象外。
- 現在の規模では、content scriptをさらに別ファイルへ分ける必要はない。

## 対象範囲

- `extension/content.js`
- `test/content.test.mjs`
- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 進捗計算の変更
- indicatorの見た目や表示位置の変更
- ON/OFF状態の永続化
- message契約変更
- manifest変更

## 実行内容

- 起動処理を名前付き関数へまとめる。
- runtime message処理とlistener登録を分ける。
- 対応ページ、toggle、対象外ページの挙動をNode標準テストで確認する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] content scriptの起点が `start()` で読み取れる
- [x] listener登録とruntime message処理が分かれている
- [x] 起動とtoggleの挙動がNode標準テストで確認できる
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

- `content.js` の起点を `start()` にまとめた。
- runtime message処理とlistener登録を名前付き関数へ分けた。
- 対応ページの起動、toggle、対象外ページをVM上で確認するテストを追加した。

## 変更ファイル

- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- `.ai/2-stabilize-extension-module-boundaries/4-content-startup/0-ticket-content-startup.md`
- `extension/content.js`
- `test/content.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは17件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] content scriptの起点が `start()` で読み取れる
- [x] listener登録とruntime message処理が分かれている
- [x] 起動とtoggleの挙動がNode標準テストで確認できる
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
