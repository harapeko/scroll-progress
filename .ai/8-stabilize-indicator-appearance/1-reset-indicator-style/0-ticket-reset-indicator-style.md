# Ticket: Reset Indicator Style

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

8: Stabilize Indicator Appearance

## 対象Mission

1: indicator styleの継承を遮断

## 目的

ページ側の文字色、font、writing mode、box modelをindicatorへ継承させない。

## 参照資料

- 要求のSOT: Grand Order 8
- API仕様: https://www.w3.org/TR/css-cascade-5/
- 現在状態: `extension/indicator.js`, `test/indicator.test.mjs`
- Grand Order: `.ai/8-stabilize-indicator-appearance/0-grand-order/grand-order.md`
- 過去Ticket: なし

## 前提

- inlineの `all: initial` で通常のauthor styleと継承を初期値へ戻す。
- `direction` は `all` の対象外なので明示する。
- indicatorに必要なstyleは初期化後にすべて設定する。

## 対象範囲

- `extension/indicator.js`
- `test/indicator.test.mjs`
- Grand Order 8
- このTicket

## 対象外

- Shadow DOM
- `!important` 対応
- styleの設定画面
- README、screenshot

## 実行内容

- `all` を `initial` にする。
- color、font family、font weightを明示する。
- direction、white space、box sizingを明示する。
- 既存styleを維持するテストを更新する。

## 変更してよい範囲

- 対象範囲に記載したファイル

## 変更してはいけない範囲

- content、core、background、badge、manifest、依存関係

## 完了条件

- [x] indicatorがpageの文字色を継承しない
- [x] fontとdirectionがindicator側で確定する
- [x] 既存の位置と操作非干渉styleを維持する
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

- indicatorのstyleを `all: initial` で初期化した。
- color、font family、font weight、direction、white space、box sizingを明示した。
- 既存styleと追加styleをまとめて検証するテストを更新した。

## 変更ファイル

- `extension/indicator.js`
- `test/indicator.test.mjs`
- Grand Order 8
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

- 実ブラウザでのvisual確認は未実施。ローカルfixtureはブラウザのURL制約で開けなかった。

## 発見した問題

- なし。

## Ticket外として見送った事項

- Shadow DOM化と `!important` 対応は、実害を確認してから別Grand Orderで評価する。

## 次に必要なTicket

- なし。
