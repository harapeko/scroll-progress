# Ticket: Exclude Indicator From Copy

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

4: ページ全体コピー時に進捗表示を混ぜない

## 目的

ページ全体を選択してコピーしたとき、拡張機能が表示している `0 %` などの進捗文字が本文コピーへ混ざりにくくする。

## 参照資料

- 要求のSOT: Issue由来の改善要望「Disable copying of extension text while copying the whole page」
- 外部根拠: Stack Overflowの回答では、`user-select: none` 系のCSSで要素内テキストの選択を抑える方法が示されている。
- 現在状態: `scroll_progress/scroll_progress.js`, `scroll_progress/core.js`, `test/core.test.mjs`

## 前提

- 現在の進捗表示は、ページ本文へ固定配置した `div` の `textContent` として描画している。
- セキュリティ目的でコピーを完全に禁止する要件ではない。
- 目的は、通常のページ選択やページ全体コピーに拡張表示が混ざる問題を減らすこと。

## 対象範囲

- `scroll_progress/core.js`
- `scroll_progress/scroll_progress.js`
- `test/core.test.mjs`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- 表示位置や見た目の変更
- 進捗計算ロジックの変更
- 追加ライブラリ
- manifest権限の追加

## 実行内容

- 進捗表示要素に `user-select: none` と `webkitUserSelect: none` を付ける。
- 進捗表示要素に `pointer-events: none` を付け、ページ本文側の操作を邪魔しにくくする。
- 進捗表示要素に `aria-hidden="true"` を付ける。
- 追加した指定をNode標準テストで確認する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- 画像アセット
- manifest権限
- package依存関係

## 完了条件

- [x] 進捗表示要素に選択除外指定が入る
- [x] 表示文字や進捗計算は変えない
- [x] 追加指定をテストで確認する

## 検証方法

- `npm run verify`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- 進捗表示要素へ `userSelect`, `webkitUserSelect`, `pointerEvents`, `aria-hidden` を設定する関数を追加した。
- 進捗表示要素の生成時に、その関数を呼ぶようにした。
- 追加した指定をNode標準テストで確認した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/4-exclude-indicator-from-copy/0-ticket-exclude-indicator-from-copy.md`
- `scroll_progress/core.js`
- `scroll_progress/scroll_progress.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは5件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 未完了事項

- なし
