# Ticket: Follow Active Scroll Area

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

6: Support Diverse Scroll Layouts

## 対象Mission

3: 操作中のscroll areaへ追随

## 目的

documentだけでなく、実際にscrollされたbodyまたはnested elementの進捗を表示する。

## 参照資料

- API仕様: https://www.w3.org/TR/cssom-view/
- API仕様: https://dom.spec.whatwg.org/
- 現在状態: `extension/content.js`, `core.js`, `test/content.test.mjs`
- Grand Order: `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`

## 前提

- elementのscroll eventはbubbleしないためcapture phaseで監視する。
- Documentがtargetの場合はdocument viewportの進捗を使う。
- Elementがtargetの場合はそのelementの進捗を使う。
- 複数ペインでは最後にscrollされたtargetを使う。

## 対象範囲

- `extension/content.js`
- `extension/core.js`
- `types/globals.d.ts`
- `test/content.test.mjs`
- `test/core.test.mjs`
- Grand Order 6
- このTicket

## 対象外

- source切断時のfallback
- resize対応
- shadow root
- README更新

## 実行内容

- documentでscroll eventをcaptureする。
- event targetからactive scroll elementを更新する。
- active elementがある場合はelement進捗を使う。
- `body overflow: auto` を除外する起動gateを削除する。
- 複数ペインと固定shellをテストする。

## 完了条件

- [x] document scrollの既存進捗を表示する
- [x] body/nested elementの進捗を表示する
- [x] 複数ペインで最後のtargetへ追随する
- [x] documentがscroll不可でもlistenerを登録する
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。

- documentのcapture listenerでscroll targetを取得するようにした。
- Elementがtargetの場合はelement進捗、それ以外はdocument進捗を使う。
- bodyのoverflowによる起動除外を削除し、固定shellでも待機するようにした。
- 複数ペイン、documentへの復帰、scroll不可なdocumentをテストした。
- `npm run typecheck` と32件のテストが成功した。
