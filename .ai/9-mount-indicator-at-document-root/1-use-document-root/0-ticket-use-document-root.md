# Ticket: Use Document Root

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

9: Mount Indicator at Document Root

## 対象Mission

1: indicatorをdocument elementへ追加

## 目的

indicatorの表示処理から `body` への依存をなくす。

## 参照資料

- 要求のSOT: Grand Order 9
- API仕様: https://www.w3.org/TR/css-transforms-1/#transform-rendering
- API仕様: https://html.spec.whatwg.org/multipage/dom.html#dom-document-body
- 現在状態: `extension/indicator.js`, `test/indicator.test.mjs`
- Grand Order: `.ai/9-mount-indicator-at-document-root/0-grand-order/grand-order.md`
- 過去Ticket: なし

## 前提

- `document.documentElement` はcontent script実行時の文書ルートとして利用できる。
- indicatorのstyle、公開API、表示切替は変更しない。

## 対象範囲

- `extension/indicator.js`
- `test/indicator.test.mjs`
- Grand Order 9
- このTicket

## 対象外

- Shadow DOM
- indicator styleの変更
- READMEの更新
- iframe、shadow root対応

## 実行内容

- indicatorを `document.documentElement` へ追加する。
- `body` がない状態を含むテストへ更新する。

## 変更してよい範囲

- 対象範囲に記載したファイル

## 変更してはいけない範囲

- content、core、background、badge、manifest、依存関係

## 完了条件

- [x] indicatorがdocument elementへ追加される
- [x] `body` を参照しないことをテストで確認できる
- [x] styleと公開APIを維持する
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

- indicatorの追加先を `document.body` から `document.documentElement` へ変更した。
- テスト環境の `body` を `null` にし、document elementへ追加されたことを検証した。

## 変更ファイル

- `extension/indicator.js`
- `test/indicator.test.mjs`
- Grand Order 9
- このTicket

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run test`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- 構文検査と型検査が成功した。
- 38件のテストが成功した。
- package内容を確認し、生成zipを削除した。
- whitespace errorはなかった。

## 完了条件の確認

- [x] すべて満たした。

## 未完了事項

- なし。

## 発見した問題

- なし。

## Ticket外として見送った事項

- document element自体のtransformへの対処は、実害が確認されていないため行わない。
- Shadow DOM化は、通常のpage CSSへの対処が現在実装で足りているため行わない。

## 次に必要なTicket

- なし。
