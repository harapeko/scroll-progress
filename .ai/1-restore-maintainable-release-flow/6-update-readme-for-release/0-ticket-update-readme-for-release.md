# Ticket: Update README For Release

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

6: READMEの公開前説明を現在実装に合わせる

## 目的

READMEの説明を、現在のON/OFF機能と公開先URLに合わせる。

## 参照資料

- 要求のSOT: ユーザー指示「next go」
- 現在状態: `README.md`, `scroll_progress/manifest.json`
- 外部根拠: Chrome Web Storeは現在 `chromewebstore.google.com` で公開ページを提供している。

## 前提

- Mission 5で、拡張アイコンによるタブ単位ON/OFFを追加した。
- READMEには「常に表示」と書かれており、現在実装とずれている。
- READMEのChrome Web Storeリンクは古いURL形式で、`publish-accepted` が含まれている。

## 対象範囲

- `README.md`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- プロダクトコード
- manifest version更新
- release workflow
- 画像アセット

## 実行内容

- READMEの表示説明を、現在のタブでhide/showできる内容に直す。
- Chrome Web Storeリンクを現行の公開ページURLに直す。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- プロダクトコード
- package依存関係

## 完了条件

- [x] READMEがON/OFF機能と矛盾しない
- [x] READMEのChrome Web Storeリンクから `publish-accepted` を外す

## 検証方法

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `GIT_CONFIG_GLOBAL=/dev/null git diff -- README.md`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- READMEの表示説明を現在実装に合わせた。
- Chrome Web Storeリンクを現行URLへ更新した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/6-update-readme-for-release/0-ticket-update-readme-for-release.md`
- `README.md`

## 検証結果

### 実行したコマンド

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `GIT_CONFIG_GLOBAL=/dev/null git diff -- README.md`

### 結果

- 空白確認に成功した。
- README差分が現在実装の説明とChrome Web Storeリンク更新だけであることを確認した。

## 完了条件の確認

- [x] READMEがON/OFF機能と矛盾しない
- [x] READMEのChrome Web Storeリンクから `publish-accepted` を外す

## 未完了事項

- なし
