# Ticket: Ignore Horizontal-only Scroll Targets

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

7: Strengthen Active Scroll Tracking

## 対象Mission

1: 縦scroll sourceだけを選択

## 目的

横方向だけのscroll elementがactive sourceを奪い、縦進捗を消すことを防ぐ。

## 参照資料

- 要求のSOT: Grand Order 7
- 現在状態: `extension/content.js`, `extension/core.js`, `test/content.test.mjs`
- Grand Order: `.ai/7-strengthen-active-scroll-tracking/0-grand-order/grand-order.md`
- 過去Ticket: `.ai/6-support-diverse-scroll-layouts/3-follow-active-scroll-area/0-ticket-follow-active-scroll-area.md`

## 前提

- `scrollHeight > clientHeight` のElementだけ縦進捗を計算できる。
- Documentのscroll eventではdocument sourceへ戻す。
- 横方向だけのElementでは現在sourceを維持する。

## 対象範囲

- `extension/content.js`
- `test/content.test.mjs`
- Grand Order 7
- このTicket

## 対象外

- ResizeObserver
- iframe、shadow root
- user操作とscript scrollの識別
- README更新

## 実行内容

- Elementの縦scroll rangeをsource変更前に確認する。
- 縦scroll rangeがないElementのscroll eventを無視する。
- Documentと縦scroll elementの既存動作を維持する。
- 横scroll後も以前の縦sourceを維持するテストを追加する。

## 変更してよい範囲

- 対象範囲に記載したファイル

## 変更してはいけない範囲

- manifest、permission、依存関係
- indicator、badge、background

## 完了条件

- [x] 横方向だけのscrollでactive sourceが変わらない
- [x] 縦scroll elementの追随を維持する
- [x] Document scrollでdocument sourceへ戻る
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run test`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- Elementをactive sourceにする前に `scrollHeight` と `clientHeight` を比較するようにした。
- 縦scroll rangeがないElementのscroll eventでは現在sourceを維持するようにした。
- 横scroll後のresizeでも以前の縦sourceを使うテストを追加した。

## 変更ファイル

- `extension/content.js`
- `test/content.test.mjs`
- Grand Order 7
- このTicket

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- 型検査が成功した。
- 36件のテストが成功した。
- package内容を確認し、生成zipを削除した。
- whitespace errorはなかった。

## 完了条件の確認

- [x] すべて満たした。

## 未完了事項

- なし。

## 発見した問題

- なし。

## Ticket外として見送った事項

- active elementのResizeObserver監視はMission 2で扱う。

## 次に必要なTicket

- active elementのresizeを監視するTicket。
