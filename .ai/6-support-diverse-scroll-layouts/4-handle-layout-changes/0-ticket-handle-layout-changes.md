# Ticket: Handle Layout Changes

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

6: Support Diverse Scroll Layouts

## 対象Mission

4: layout変化時の再計算

## 目的

resizeやDOM更新後も、古いscroll進捗を残さず現在のlayoutへ追随する。

## 参照資料

- API仕様: https://www.w3.org/TR/cssom-view/
- API仕様: https://dom.spec.whatwg.org/
- 現在状態: `extension/content.js`, `test/content.test.mjs`
- Grand Order: `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`

## 前提

- resize時は現在のscroll sourceを再計算する。
- active elementがDocumentから外れた場合はdocument進捗へ戻す。
- 現在sourceが縦scroll不可の場合はindicatorを隠す。

## 対象範囲

- `extension/content.js`
- `test/content.test.mjs`
- Grand Order 6
- このTicket

## 対象外

- DOM mutationの常時監視
- scroll area候補の全走査
- CSS疑似Fullscreen
- README更新

## 実行内容

- resize listenerを追加する。
- active elementの接続状態を再計算前に確認する。
- 進捗を計算できない場合はindicatorを隠す。
- resize、source切断、非scrollable化をテストする。

## 完了条件

- [x] resize後に現在sourceの進捗を再計算する
- [x] source切断後はdocument進捗へ戻る
- [x] sourceがscroll不可になった場合はindicatorを隠す
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。

- resize時にthrottle済みの更新処理を呼ぶlistenerを追加した。
- active elementが切断済みならdocument進捗へ戻すようにした。
- 現在sourceの進捗を計算できない場合はindicatorを隠すようにした。
- resize、source切断、非scrollable化をテストした。
- `npm run typecheck` と35件のテストが成功した。
