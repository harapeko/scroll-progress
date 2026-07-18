# Ticket: Background Message Failure

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

2: Stabilize Extension Module Boundaries

## 対象Mission

5: service workerのmessage失敗時挙動を明示する

## 目的

content scriptへmessageを送れないタブで、service workerが古いbadgeを残さないことを明示する。

## 参照資料

- 要求のSOT: ユーザー指示「go」
- Grand Order: `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- 現在状態: `extension/background.js`, `extension/badge.js`, `extension/core.js`

## 前提

- content scriptから確認できたON/OFF状態だけをbadgeへ反映する。
- Chrome内部ページなど、content scriptへmessageを送れないタブがある。
- 現在の実装は送信失敗時と不正response受信時にbadgeを消している。
- 新しいエラー表示やpermissionは追加しない。

## 対象範囲

- `extension/background.js`
- `test/background.test.mjs`
- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- このTicket

## 対象外

- content scriptの変更
- badgeの表示文字や色の変更
- 新しいエラーUI
- manifest変更
- permission追加

## 実行内容

- action click、toggle応答、tab更新の処理を名前付き関数へ分ける。
- message送信失敗時と不正response受信時にbadgeを消す契約をテストする。
- 正常応答時とページ遷移開始時のbadge処理も確認する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] message失敗時の処理が名前付き関数で読み取れる
- [x] 受信先不在と不正responseでbadgeが消える
- [x] 正常応答時だけbadgeへON/OFF状態を反映する
- [x] service workerの挙動がNode標準テストで確認できる
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

- toggle応答の反映、action click、tab更新を名前付き関数へ分けた。
- 送信失敗または不正responseではbadgeを消す処理を明示した。
- service workerをVM上で実行するNode標準テストを追加した。

## 変更ファイル

- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- `.ai/2-stabilize-extension-module-boundaries/5-background-message-failure/0-ticket-background-message-failure.md`
- `extension/background.js`
- `test/background.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは22件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] message失敗時の処理が名前付き関数で読み取れる
- [x] 受信先不在と不正responseでbadgeが消える
- [x] 正常応答時だけbadgeへON/OFF状態を反映する
- [x] service workerの挙動がNode標準テストで確認できる
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
