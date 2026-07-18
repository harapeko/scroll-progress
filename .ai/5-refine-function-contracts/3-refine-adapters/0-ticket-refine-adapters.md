# Ticket: Refine Adapters

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

3: adapter関数を整理する

## 目的

content、background、badgeの関数名、引数型、非同期処理を呼び出し実態へ合わせる。

## 参照資料

- Grand Order: `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- 現在状態: `extension/content.js`, `background.js`, `badge.js`
- Chrome型: `@types/chrome`

## 前提

- `load` eventは1回だけ発火し、wait 0のthrottleを通しても実行回数は変わらない。
- `applyEnabled` の呼び出し側はbooleanだけを渡す。
- `runtime.lastError` は `sendMessage` callback内で確認する。
- badge更新失敗はタブ終了時などに起こり、再試行しない。

## 対象範囲

- `extension/content.js`
- `extension/background.js`
- `extension/badge.js`
- `test/content.test.mjs`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- event追加または削除
- scroll待機時間変更
- badge表示仕様変更
- Promise失敗時のUI追加

## 実行内容

- `applyEnabled` を `setEnabled` へ改名する。
- runtime message handlerのJSDocをChrome型と実際のresponseへ合わせる。
- `load` listenerへ `updateProgress` を直接渡す。
- background response処理で `lastError` を先に確認する。
- background handlerのJSDocをChrome型へ合わせる。
- badge Promise helperを目的が分かる名前へ変更する。
- badge公開objectへproperty shorthandを適用する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] contentの状態更新関数がboolean契約を表す
- [x] load eventに不要なthrottleを使わない
- [x] backgroundがmessage失敗をresponseより先に扱う
- [x] badge helperの目的が名前で分かる
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

- contentの状態更新関数を `setEnabled` へ改名した。
- runtime message handlerのJSDocをChrome型とboolean responseへ合わせた。
- `load` eventからwait 0のthrottleを外した。
- backgroundは `runtime.lastError` を確認してからresponseを読むようにした。
- background handlerのJSDocを `Tab`, `OnUpdatedInfo` へ合わせた。
- badge Promise helperを `ignoreBadgeUpdateFailure` へ改名した。
- badge公開objectへproperty shorthandを適用した。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/3-refine-adapters/0-ticket-refine-adapters.md`
- `extension/content.js`
- `extension/background.js`
- `extension/badge.js`
- `test/content.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run typecheck` は成功した。
- `npm run verify` は成功し、Node標準テストは28件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 完了条件の確認

- [x] contentの状態更新関数がboolean契約を表す
- [x] load eventに不要なthrottleを使わない
- [x] backgroundがmessage失敗をresponseより先に扱う
- [x] badge helperの目的が名前で分かる
- [x] 型検査と全テストが通る
- [x] package生成が成功する

## 未完了事項

- なし。
