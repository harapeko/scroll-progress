# Ticket: Bump Version

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

9: 公開用に拡張versionを上げる

## 目的

Chrome Web Storeへ新しいpackageを出せるように、manifest versionを上げる。

## 参照資料

- 要求のSOT: ユーザー指示「next go」
- 現在状態: `scroll_progress/manifest.json`
- Grand Order: Mission 5でON/OFF機能を追加済み。

## 前提

- 現在のmanifest versionは `1.0.3`。
- 今回の公開には、ページコピー対策、ON/OFF機能、release flow整備が含まれる。
- ON/OFF機能はユーザー向けの機能追加なので、patchではなくminorとして `1.1.0` に上げる。

## 対象範囲

- `scroll_progress/manifest.json`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- プロダクトコード
- GitHub Actions workflow
- Chrome Web Store上の公開操作
- 生成zip

## 実行内容

- `scroll_progress/manifest.json` の `version` を `1.0.3` から `1.1.0` へ変更する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- workflow

## 完了条件

- [x] manifest versionが `1.1.0` になっている
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 検証方法

- `node -e "const m=require('./scroll_progress/manifest.json'); if (m.version !== '1.1.0') throw new Error(m.version); console.log(m.version)"`
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

- `scroll_progress/manifest.json` のversionを `1.1.0` へ変更した。
- Grand OrderへMission 9を記録した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/9-bump-version/0-ticket-bump-version.md`
- `scroll_progress/manifest.json`

## 検証結果

### 実行したコマンド

- `node -e "const m=require('./scroll_progress/manifest.json'); if (m.version !== '1.1.0') throw new Error(m.version); console.log(m.version)"`
- `npm run verify`
- `unzip -l scroll_progress.zip`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- manifest versionが `1.1.0` であることを確認した。
- `npm run verify` は成功した。
- `unzip -l` でzipに必要ファイルが入っていることを確認した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] manifest versionが `1.1.0` になっている
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし
