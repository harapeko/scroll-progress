# Ticket: Add Privacy Policy

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

7: Privacy Policyを公開前に用意する

## 目的

Chrome Web Store掲載情報で参照できるPrivacy Policyを用意する。

## 参照資料

- 要求のSOT: ユーザー指示「tweet pageでやっていた改善を進めて」
- 現在状態: `scroll_progress/manifest.json`, `scroll_progress/scroll_progress.js`, `scroll_progress/background.js`
- 過去Ticket: Tweet Pageで追加した `PRIVACY.md`

## 前提

- Scroll Progressはページのスクロール位置から表示用の割合を計算する。
- Scroll Progressはユーザーデータを開発者へ送信しない。
- Mission 5のON/OFF状態は永続保存しない。
- manifestに `permissions` キーはない。

## 対象範囲

- `PRIVACY.md`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- プロダクトコード
- manifest
- release workflow
- README

## 実行内容

- `PRIVACY.md` を追加する。
- データ収集なし、永続保存なし、analyticsなし、remote codeなしを明記する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- プロダクトコード
- package依存関係

## 完了条件

- [x] Privacy Policyが追加されている
- [x] 現在実装と矛盾する保存・送信の記載がない

## 検証方法

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `node -e "const m=require('./scroll_progress/manifest.json'); if (m.permissions) throw new Error('permissions must not be present'); console.log('no permissions')"`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `PRIVACY.md` を追加した。
- Grand OrderへMission 7を記録した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/7-add-privacy-policy/0-ticket-add-privacy-policy.md`
- `PRIVACY.md`

## 検証結果

### 実行したコマンド

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `node -e "const m=require('./scroll_progress/manifest.json'); if (m.permissions) throw new Error('permissions must not be present'); console.log('no permissions')"`

### 結果

- 空白確認に成功した。
- manifestに `permissions` キーがないことを確認した。

## 完了条件の確認

- [x] Privacy Policyが追加されている
- [x] 現在実装と矛盾する保存・送信の記載がない

## 未完了事項

- なし
