# Ticket: Setup Workflow Baseline

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

1: 作業管理とpackage生成基盤を整える

## 目的

Scroll Progressでも、AI作業管理と再現可能なzip生成を使えるようにする。

## 参照資料

- 要求のSOT: ユーザー指示「ここまでの活かせた作業をこちらでも実行」
- 現在状態: `scroll_progress/manifest.json`, `scroll_progress/scroll_progress.js`, `scroll_progress.zip`, `README.md`

## 前提

- `scroll_progress/manifest.json` はすでにManifest V3。
- 既存の `scroll_progress.zip` はgitで追跡されており、`__MACOSX` を含む。
- このTicketでは拡張機能の動作を変更しない。

## 対象範囲

- `AGENTS.md`
- `.ai/`
- `.gitignore`
- `package.json`
- `scripts/build-zip.sh`
- `scroll_progress.zip` の追跡解除

## 対象外

- `scroll_progress/` 配下のプロダクトコード
- Chrome Web Store release workflow
- 依存関係追加
- 表示や挙動の変更

## 実行内容

- Grand Order / Ticket運用資料を追加する。
- 依存なしのnpm scriptsを追加する。
- `scripts/build-zip.sh` で `scroll_progress.zip` を再現生成できるようにする。
- `scroll_progress.zip` をgit追跡から外し、 `.gitignore` に追加する。

## 変更してよい範囲

- `AGENTS.md`
- `.ai/`
- `.gitignore`
- `package.json`
- `scripts/build-zip.sh`
- `scroll_progress.zip`

## 変更してはいけない範囲

- `scroll_progress/manifest.json`
- `scroll_progress/scroll_progress.js`
- `scroll_progress/icons/`
- `images/`

## 完了条件

- [x] AI作業管理資料がある
- [x] `npm run verify` が通る
- [x] `npm run build:zip` でzipを生成できる
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

- `AGENTS.md` を追加した。
- `.ai/README.md` とテンプレートを追加した。
- Grand OrderとTicketを追加した。
- `package.json` にsyntax/build/clean/verify scriptを追加した。
- `scripts/build-zip.sh` を追加した。
- `scroll_progress.zip` を追跡対象から外した。
- `.gitignore` に生成zipとローカル環境ファイルを追加した。

## 変更ファイル

- `.ai/`
- `.gitignore`
- `AGENTS.md`
- `package.json`
- `scripts/build-zip.sh`
- `scroll_progress.zip`

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

- [x] AI作業管理資料がある
- [x] `npm run verify` が通る
- [x] `npm run build:zip` でzipを生成できる
- [x] 生成zipをコミットしない

## 未完了事項

- プロダクトコードの保守改善は次のTicketで扱う。

## 発見した問題

- 既存の `scroll_progress.zip` は `__MACOSX` を含む手作業生成物だった。

## Ticket外として見送った事項

- Chrome Web Store release workflow追加。
- JavaScriptのリファクタリング。

## 次に必要なTicket

- `scroll_progress.js` の保守性改善とテスト追加。
