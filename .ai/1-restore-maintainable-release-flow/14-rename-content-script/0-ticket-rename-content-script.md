# Ticket: Rename Content Script

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

14: content scriptのファイル名を役割名にする

## 目的

content script本体のファイル名を、役割が分かる名前へ変更する。

## 参照資料

- 要求のSOT: ユーザー指示「コードのリファクタすすめて」
- 現在状態: `extension/scroll_progress.js`, `extension/manifest.json`, `scripts/build-zip.sh`
- 過去Ticket: Mission 11で拡張ソースを `extension/` へ移動済み。

## 前提

- `scroll_progress.js` はcontent script本体だが、ファイル名だけでは役割が分かりにくい。
- buildなしの構成なので、manifestとzip対象を同時に更新する必要がある。
- 挙動は変えない。

## 対象範囲

- `extension/scroll_progress.js` から `extension/content.js` への改名
- `extension/manifest.json`
- `scripts/build-zip.sh`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- content scriptの処理内容変更
- manifest version変更
- 追加ライブラリ

## 実行内容

- `extension/scroll_progress.js` を `extension/content.js` へ改名する。
- manifestのcontent script参照を `content.js` に変更する。
- build scriptのzip対象を `content.js` に変更する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] content script本体が `content.js` になっている
- [x] manifestが `content.js` を読み込む
- [x] `extension.zip` に `content.js` が含まれる
- [x] `npm run verify` が通る

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

- `extension/scroll_progress.js` を `extension/content.js` へ改名した。
- manifestとbuild scriptの参照を更新した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/14-rename-content-script/0-ticket-rename-content-script.md`
- `extension/content.js`
- `extension/manifest.json`
- `scripts/build-zip.sh`

## 検証結果

### 実行したコマンド

- `rg "scroll_progress\\.js|content\\.js" -n`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- 旧ファイル名の参照が残っていないことを確認した。
- `npm run verify` は成功した。
- `extension.zip` に `content.js` が含まれることを確認した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] content script本体が `content.js` になっている
- [x] manifestが `content.js` を読み込む
- [x] `extension.zip` に `content.js` が含まれる
- [x] `npm run verify` が通る

## 未完了事項

- なし
