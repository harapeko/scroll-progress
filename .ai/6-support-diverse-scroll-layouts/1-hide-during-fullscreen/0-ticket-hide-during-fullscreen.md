# Ticket: Hide During Fullscreen

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

6: Support Diverse Scroll Layouts

## 対象Mission

1: Fullscreen中の非表示と復帰

## 目的

Fullscreen API利用中はindicatorを隠し、解除後に現在の進捗表示へ戻す。

## 参照資料

- 要求のSOT: 動画最大化時にindicatorが邪魔にならないこと。
- API仕様: https://fullscreen.spec.whatwg.org/
- 現在状態: `extension/content.js`, `test/content.test.mjs`
- Grand Order: `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`

## 前提

- `document.fullscreenElement` が存在する間をFullscreen中とする。
- `fullscreenchange` はdocumentで監視する。
- CSS疑似fullscreenはこのTicketで判定しない。

## 対象範囲

- `extension/content.js`
- `test/content.test.mjs`
- Grand Order 6
- このTicket

## 対象外

- scroll sourceの変更
- resize対応
- README更新

## 実行内容

- 進捗更新時にFullscreen状態を確認する。
- Fullscreen中はindicatorを隠す。
- `fullscreenchange` で状態を再評価する。
- Fullscreen開始と解除をテストする。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] Fullscreen開始時にindicatorを隠す
- [x] Fullscreen解除後に進捗表示へ戻る
- [x] toggleと既存scroll処理が変わらない
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

- 進捗更新時に `document.fullscreenElement` を確認するようにした。
- Fullscreen中はindicatorを外すようにした。
- `fullscreenchange` を監視し、解除後に現在進捗を再表示するようにした。
- Fullscreen開始と解除のテストを追加した。

## 変更ファイル

- `.ai/6-support-diverse-scroll-layouts/0-grand-order/grand-order.md`
- `.ai/6-support-diverse-scroll-layouts/1-hide-during-fullscreen/0-ticket-hide-during-fullscreen.md`
- `extension/content.js`
- `test/content.test.mjs`

## 検証結果

- 構文検査と型検査は成功した。
- Node標準テストは30件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 未完了事項

- CSS疑似fullscreenは標準状態がないため対象外とした。

## 次に必要なTicket

- documentとelementの進捗計算を共通化する。
