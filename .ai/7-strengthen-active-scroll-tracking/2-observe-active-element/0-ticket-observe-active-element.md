# Ticket: Observe Active Scroll Element

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

7: Strengthen Active Scroll Tracking

## 対象Mission

2: active elementのresizeを監視

## 目的

viewport resizeを伴わないpaneやsidebarのサイズ変更後も、active sourceの進捗を再計算する。

## 参照資料

- 要求のSOT: Grand Order 7
- API仕様: https://www.w3.org/TR/resize-observer/
- 現在状態: `extension/content.js`, `test/content.test.mjs`
- Grand Order: `.ai/7-strengthen-active-scroll-tracking/0-grand-order/grand-order.md`
- 過去Ticket: `.ai/7-strengthen-active-scroll-tracking/1-ignore-horizontal-scroll/0-ticket-ignore-horizontal-scroll.md`

## 前提

- ResizeObserverはElementのサイズ変更、DOMからの削除、`display: none` を通知する。
- 監視対象はactive element 1件だけとする。
- 再計算には既存のthrottle済み処理を使う。

## 対象範囲

- `extension/content.js`
- `test/content.test.mjs`
- Grand Order 7
- このTicket

## 対象外

- DocumentのResizeObserver監視
- 全scroll elementの事前探索
- MutationObserver、polling
- README更新

## 実行内容

- active sourceの切り替え処理を1か所へ集約する。
- 新しいactive elementをResizeObserverへ登録する。
- source変更時は以前のelementを監視解除する。
- observer通知で現在進捗を再計算する。
- resize、source切り替え、切断、非表示をテストする。

## 変更してよい範囲

- 対象範囲に記載したファイル

## 変更してはいけない範囲

- manifest、permission、依存関係
- indicator、badge、background、core

## 完了条件

- [x] active elementだけを監視する
- [x] source変更時に以前のelementを監視解除する
- [x] element resize後に現在進捗を再計算する
- [x] element切断後はDocumentへ戻る
- [x] elementがscroll不可になった場合はindicatorを隠す
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- active sourceの切り替えとResizeObserverのobserve/unobserveを1か所へ集約した。
- observer通知を既存のthrottle済み更新処理へ接続した。
- element resize、source変更、切断、scroll不可化をテストした。

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
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`

### 結果

- 構文検査と型検査が成功した。
- 37件のテストが成功した。
- package内容を確認し、生成zipを削除した。
- whitespace errorはなかった。

## 完了条件の確認

- [x] すべて満たした。

## 未完了事項

- なし。

## 発見した問題

- READMEのiframeとshadow rootの制約を現在実装へ合わせる必要がある。

## Ticket外として見送った事項

- iframe、shadow root、indicatorのCSS隔離は対象外とした。

## 次に必要なTicket

- READMEの対応契約を訂正するTicket。
