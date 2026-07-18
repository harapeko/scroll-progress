# Ticket: Link Privacy Policy

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

10: READMEからPrivacy Policyへ辿れるようにする

## 目的

公開前に、READMEからPrivacy Policyへ辿れる導線を用意する。

## 参照資料

- 要求のSOT: ユーザー指示「next go」
- 現在状態: `README.md`, `PRIVACY.md`
- Grand Order: Mission 7でPrivacy Policyを追加済み。

## 前提

- Chrome Web Store掲載情報ではPrivacy Policy URLを入力することがある。
- GitHub上でREADMEからPrivacy Policyへ辿れれば、公開URLの確認がしやすい。

## 対象範囲

- `README.md`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- Privacy Policy本文の変更
- プロダクトコード
- manifest
- release workflow

## 実行内容

- READMEにPrivacy節を追加する。
- `PRIVACY.md` への相対リンクを追加する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- プロダクトコード
- package依存関係

## 完了条件

- [x] READMEから `PRIVACY.md` へ辿れる
- [x] Privacy Policy本文は変更しない

## 検証方法

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `GIT_CONFIG_GLOBAL=/dev/null git diff -- README.md PRIVACY.md`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- READMEにPrivacy節を追加した。
- `PRIVACY.md` へのリンクを追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/10-link-privacy-policy/0-ticket-link-privacy-policy.md`
- `README.md`

## 検証結果

### 実行したコマンド

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `GIT_CONFIG_GLOBAL=/dev/null git diff -- README.md PRIVACY.md`

### 結果

- 空白確認に成功した。
- `README.md` にPrivacy節が追加され、`PRIVACY.md` 本文に変更がないことを確認した。

## 完了条件の確認

- [x] READMEから `PRIVACY.md` へ辿れる
- [x] Privacy Policy本文は変更しない

## 未完了事項

- なし
