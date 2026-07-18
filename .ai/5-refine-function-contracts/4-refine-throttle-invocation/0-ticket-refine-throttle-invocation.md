# Ticket: Refine Throttle Invocation

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

4: throttleの実行状態を集約する

## 目的

throttleの先頭実行と末尾実行で重複している状態更新をまとめ、実行時刻に依存せず最初の呼び出しを即時実行する。

## 参照資料

- Grand Order: `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `test/core.test.mjs`, `types/globals.d.ts`
- 利用箇所: `extension/content.js`

## 前提

- productionの利用箇所はcallbackへ引数を渡さず、`this` も参照しない。
- 公開型は `throttle(callback: () => void, wait: number): () => void` である。
- 最初は即時実行し、待機中の呼び出しは最後に1回実行する。

## 対象範囲

- `extension/core.js`
- `test/core.test.mjs`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- callback引数と `this` の転送
- `cancel` または `flush` の追加
- 待機時間の設定変更
- 公開型の変更

## 実行内容

- 最終実行時刻の初期値で、最初の呼び出しが即時実行されることを表す。
- timer解除、最終実行時刻の更新、callback実行をprivate関数へ集める。
- 時刻0から始まる場合の回帰テストを追加する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] 時刻0でも最初の呼び出しが即時実行される
- [x] 待機中の連続呼び出しが最後に1回だけ実行される
- [x] 期限切れtimerによる二重実行がない
- [x] 公開型が変わらない
- [x] 型検査と全テストが通る
- [x] package生成が成功する

## 検証方法

- `npm run typecheck`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- 最終実行時刻を負の無限大で初期化し、最初の即時実行を時刻に依存しない形にした。
- timer状態の解除、最終実行時刻の更新、callback実行を `invoke` に集めた。
- 時刻0から始まる回帰テストを追加した。
- callback引数と `this` の転送は、現在の利用箇所と公開型にないため追加しなかった。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/4-refine-throttle-invocation/0-ticket-refine-throttle-invocation.md`
- `extension/core.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run test`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- 構文検査と型検査は成功した。
- Node標準テストは29件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 完了条件の確認

- [x] 時刻0でも最初の呼び出しが即時実行される
- [x] 待機中の連続呼び出しが最後に1回だけ実行される
- [x] 期限切れtimerによる二重実行がない
- [x] 公開型が変わらない
- [x] 型検査と全テストが通る
- [x] package生成が成功する

## 未完了事項

- なし。
