# Ticket: Add Actions Release

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

8: GitHub Actionsで検証と公開packageを作る

## 目的

Tweet Pageで使ったGitHub Actionsの検証・公開手順を、Scroll Progress向けに移植する。

## 参照資料

- 要求のSOT: ユーザー指示「tweet pageでやっていた改善を進めて」
- 現在状態: `package.json`, `scripts/build-zip.sh`, `scroll_progress/manifest.json`
- 過去Ticket: Tweet PageのCI/release workflow
- 外部根拠: Chrome Web Store APIはOAuth token取得後、upload APIとpublish APIでitemを更新できる。

## 前提

- 生成zip名は `scroll_progress.zip`。
- Chrome Web Store item IDは `lcmhhnccfbeinmgacmomlkcahidhjifb`。
- GitHub Environment名はTweet Pageと同じ `chrome-web-store` を使う。
- secret名はTweet Pageと同じ `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN`, `CHROME_PUBLISHER_ID` を使う。
- 新しいnpm依存は追加しない。

## 対象範囲

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `package.json`
- `package-lock.json`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- プロダクトコード
- manifest version更新
- Chrome Web Store上の手動設定
- secret値の作成

## 実行内容

- CI workflowを追加し、push/pull_requestで `npm ci` と `npm run verify` を実行する。
- CI artifactとして `scroll_progress.zip` を保存する。
- release workflowを追加し、tag pushまたは手動実行でChrome Web Storeへuploadできるようにする。
- 手動実行では `publish` inputでpublish有無を選べるようにする。
- `npm ci` 用にlockfileを追加する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- プロダクトコード
- 画像アセット
- secret値

## 完了条件

- [x] CI workflowが追加されている
- [x] release workflowが追加されている
- [x] workflowは `scroll_progress.zip` をartifact/upload対象にしている
- [x] `npm ci` で検証できる

## 検証方法

- `npm install --package-lock-only`
- `npm ci`
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

- CI workflowを追加した。
- Chrome Web Store release workflowを追加した。
- Node enginesを `>=20` として明記した。
- `npm ci` 用にlockfileを追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/8-add-actions-release/0-ticket-add-actions-release.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `package-lock.json`
- `package.json`

## 検証結果

### 実行したコマンド

- `npm install --package-lock-only`
- `npm ci`
- `npm run verify`
- `unzip -l scroll_progress.zip`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm install --package-lock-only` は成功し、脆弱性は0件だった。
- `npm ci` は成功し、脆弱性は0件だった。
- `npm run verify` は成功した。
- `unzip -l` で `scroll_progress.zip` に必要ファイルが入っていることを確認した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] CI workflowが追加されている
- [x] release workflowが追加されている
- [x] workflowは `scroll_progress.zip` をartifact/upload対象にしている
- [x] `npm ci` で検証できる

## 未完了事項

- なし
