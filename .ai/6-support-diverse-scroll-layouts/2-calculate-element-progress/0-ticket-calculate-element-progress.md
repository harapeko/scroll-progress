# Ticket: Calculate Element Progress

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

6: Support Diverse Scroll Layouts

## 対象Mission

2: documentとelementの進捗計算を共通化

## 目的

documentの既存計算を維持しながら、elementの縦スクロール進捗も同じcoreで計算できるようにする。

## 参照資料

- API仕様: https://www.w3.org/TR/cssom-view/
- 現在状態: `extension/core.js`, `types/globals.d.ts`, `test/core.test.mjs`
- Grand Order: `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`

## 前提

- document viewportの高さには既存どおり `window.innerHeight` を使う。
- element viewportの高さには `clientHeight` を使う。
- 割合計算、範囲制限、整数化は `calculateProgress` が所有する。

## 対象範囲

- `extension/core.js`
- `types/globals.d.ts`
- `test/core.test.mjs`
- Grand Order 6
- このTicket

## 対象外

- scroll event処理
- source選択
- content script変更

## 実行内容

- element metricsから進捗を計算する関数を追加する。
- document用とelement用の型を分ける。
- scroll可能、scroll不可、範囲外をテストする。

## 完了条件

- [x] elementの縦スクロール進捗を計算できる
- [x] scrollできないelementでは `null` を返す
- [x] documentの既存計算結果が変わらない
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。

## 実施内容

- elementの `scrollTop`, `scrollHeight`, `clientHeight` から進捗を計算する関数を追加した。
- document用metricsとelement用metricsの型を分けた。
- scroll可能、範囲外、scroll不可のelementをテストした。

## 変更ファイル

- `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`
- `.ai/6-support-diverse-scroll-layouts/2-calculate-element-progress/0-ticket-calculate-element-progress.md`
- `extension/core.js`
- `types/globals.d.ts`
- `test/core.test.mjs`

## 検証結果

- 構文検査と型検査は成功した。
- Node標準テストは31件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 未完了事項

- source選択は次のTicketで扱う。

## 次に必要なTicket

- scroll eventのtargetから現在のsourceを更新する。
