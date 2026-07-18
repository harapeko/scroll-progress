# Ticket: Rename Extension Source

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

11: 拡張ソースとpackage名を分かりやすくする

## 目的

拡張機能のソースディレクトリと生成zip名を、役割が分かる名前にする。

## 参照資料

- 要求のSOT: ユーザー指示「コードのリファクタをすすめて」
- 現在状態: `scroll_progress/`, `scripts/build-zip.sh`, `package.json`, `.github/workflows/`
- 過去の判断: Tweet Pageでは拡張ソースを `extension/` に置いている。

## 前提

- 現在のソースディレクトリ名 `scroll_progress/` は拡張機能ソースであることが分かりにくい。
- 生成zip名 `scroll_progress.zip` もworkflowから見ると役割が分かりにくい。
- zip内の構造は変えない。`manifest.json` は引き続きzipルートへ置く。

## 対象範囲

- `scroll_progress/` から `extension/` への移動
- `scripts/build-zip.sh`
- `package.json`
- `.gitignore`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `test/core.test.mjs`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- プロダクトコードの挙動変更
- manifest version変更
- Chrome Web Store公開操作
- 追加ライブラリ

## 実行内容

- `scroll_progress/` を `extension/` へ移動する。
- syntax check対象を `extension/` に変更する。
- build scriptの入力ディレクトリを `extension/` に変更する。
- 生成zip名を `extension.zip` に変更する。
- CI/release workflowのartifact/upload対象を `extension.zip` に変更する。
- テストのfixture読み込みパスを更新する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセットの内容

## 完了条件

- [x] 拡張ソースが `extension/` 配下にある
- [x] `npm run verify` が通る
- [x] `extension.zip` のrootに `manifest.json` がある
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

- `scroll_progress/` を `extension/` へ移動した。
- npm scripts、build script、workflow、テストの参照を更新した。
- 生成zip名を `extension.zip` に変更した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/11-rename-extension-source/0-ticket-rename-extension-source.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `.gitignore`
- `extension/background.js`
- `extension/core.js`
- `extension/icons/icon@128px.png`
- `extension/icons/icon@16px.png`
- `extension/icons/icon@48px.png`
- `extension/manifest.json`
- `extension/screenshot.png`
- `extension/scroll_progress.js`
- `package.json`
- `scripts/build-zip.sh`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- `extension.zip` のrootに `manifest.json` があることを確認した。
- 生成zipは削除済み。
- 旧zip名の生成物も存在しないことを確認した。
- 空白確認に成功した。

## 完了条件の確認

- [x] 拡張ソースが `extension/` 配下にある
- [x] `npm run verify` が通る
- [x] `extension.zip` のrootに `manifest.json` がある
- [x] 生成zipをコミットしない

## 未完了事項

- なし
