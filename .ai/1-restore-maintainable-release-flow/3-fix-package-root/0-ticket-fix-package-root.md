# Ticket: Fix Package Root

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

3: Chrome Web Store向けzip構造に直す

## 目的

Chrome Web Storeへuploadしやすいように、zip内の `manifest.json` をルートへ置く。

## 参照資料

- 要求のSOT: ユーザー指示「ここまでの活かせた作業をこちらでも実行」
- 現在状態: `scripts/build-zip.sh`, `scroll_progress/manifest.json`
- 外部根拠: Chrome Web Storeのzip uploadではmanifestとzipがvalidである必要がある。

## 前提

- 既存のbuild scriptは `scroll_progress/` ディレクトリごとzipに入れている。
- Chrome拡張のpackageでは、manifestをzipルートに置く構造のほうが安全。

## 対象範囲

- `scripts/build-zip.sh`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 拡張機能コード
- manifest version更新
- release workflow

## 実行内容

- `scripts/build-zip.sh` を `scroll_progress/` 配下で実行し、manifestと必要ファイルをzipルートへ入れる。
- 生成zipの中身を確認する。

## 変更してよい範囲

- `scripts/build-zip.sh`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/3-fix-package-root/0-ticket-fix-package-root.md`

## 変更してはいけない範囲

- `scroll_progress/`
- `package.json`
- 生成zip

## 完了条件

- [x] buildしたzipのルートに `manifest.json` がある
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run verify`
- `unzip -l scroll_progress.zip`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- build scriptを `scroll_progress/` 配下でzipする形に変更した。
- zip対象を `manifest.json`, `core.js`, `scroll_progress.js`, `icons`, `screenshot.png` にした。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/3-fix-package-root/0-ticket-fix-package-root.md`
- `scripts/build-zip.sh`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `unzip -l scroll_progress.zip`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- `unzip -l` でzipルートに `manifest.json` があることを確認した。
- `npm run clean` は成功した。
- `scroll_progress.zip` が削除されていることを確認した。
- 空白確認に成功した。

## 完了条件の確認

- [x] buildしたzipのルートに `manifest.json` がある
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし
