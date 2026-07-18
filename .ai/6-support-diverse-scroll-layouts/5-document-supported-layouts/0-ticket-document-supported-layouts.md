# Ticket: Document Supported Layouts

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

6: Support Diverse Scroll Layouts

## 対象Mission

5: READMEへ対応layoutを図示

## 目的

利用者が対応layoutと制約をREADMEだけで判断できるようにする。

## 参照資料

- API仕様: https://www.w3.org/TR/cssom-view/
- API仕様: https://dom.spec.whatwg.org/
- API仕様: https://fullscreen.spec.whatwg.org/
- 現在状態: `extension/content.js`, `extension/core.js`, `test/*.mjs`
- Grand Order: `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`

## 対象範囲

- `README.md`
- Grand Order 6
- このTicket

## 対象外

- extensionの挙動変更
- screenshotの更新
- 対応していないlayoutの実装予定

## 実行内容

- 対応layoutを表にする。
- 標準ページ、固定shell、複数ペインをMermaidで図示する。
- source選択とFullscreenの判定フローをMermaidで図示する。
- 非対応範囲と技術仕様へのリンクを記載する。
- 古いサイト別の非対応一覧を削除する。

## 完了条件

- [x] 対応layoutと動作が表で分かる
- [x] layoutと判定フローの図がある
- [x] Fullscreen中の動作が明記されている
- [x] 非対応範囲が明記されている
- [x] 実装とREADMEの説明が一致する

## 検証方法

- `README.md` の表とMermaid構文を確認する
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。

- 対応layoutをサイト名ではなくscroll構造ごとの表へ置き換えた。
- 標準document、固定shell、複数ペインをMermaidで図示した。
- source選択、Fullscreen、scroll rangeの判定フローをMermaidで図示した。
- cross-origin iframe、closed shadow root、疑似Fullscreenなどの制約を明記した。
- CSSOM View、DOM、Fullscreenの各標準仕様へリンクした。
