# Ticket: Handle Chrome API Promises

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

3: Eliminate JavaScript Analysis Warnings

## 対象Mission

4: Chrome APIの非同期完了を明示する

## 目的

Chrome APIのPromise未処理警告を、APIの実際の呼び出し方に合わせて解消する。

## 参照資料

- 要求のSOT: ユーザーから提示されたWebStorm警告
- Chrome公式: <https://developer.chrome.com/docs/extensions/reference/api/tabs#method-sendMessage>
- Chrome公式: <https://developer.chrome.com/docs/extensions/reference/api/action#method-setBadgeText>
- Chrome公式: <https://developer.chrome.com/docs/extensions/reference/api/action#method-setBadgeBackgroundColor>
- JetBrains公式: <https://www.jetbrains.com/help/inspectopedia/JSIgnoredPromiseFromCall.html>
- 型定義: `node_modules/@types/chrome/index.d.ts`
- 現在状態: `extension/background.js`, `extension/badge.js`

## 前提

- callbackを渡した `tabs.sendMessage` はPromiseを返さない。
- callbackを渡していないbadge APIは `Promise<void>` を返す。
- badge更新先のタブが終了していても、拡張機能の主処理は継続できる。

## 対象範囲

- `extension/background.js`
- `extension/badge.js`
- `test/badge.test.mjs`
- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- このTicket

## 対象外

- Chrome APIの呼び出し順変更
- manifest変更
- UI変更
- 実行時依存追加

## 実行内容

- callback版 `tabs.sendMessage` の誤検知を呼び出し箇所だけで抑制する。
- badge APIのPromiseを `badge.js` 内で完了させる。
- badge更新とreject処理のテストを追加する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- manifest

## 完了条件

- [x] `sendMessage` の抑制理由が公式仕様と一致する
- [x] badge APIのPromiseが未処理にならない
- [x] badge更新先がなくても未処理rejectが残らない
- [x] 型検査とテストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- callback版 `tabs.sendMessage` の呼び出しに、WebStormの誤検知を抑える指示を付けた。
- badge APIのPromiseを `badge.js` 内で完了させるようにした。
- badgeの更新、消去、reject処理を単体テストへ追加した。

## 変更ファイル

- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- `.ai/3-eliminate-javascript-analysis-warnings/4-handle-chrome-api-promises/0-ticket-handle-chrome-api-promises.md`
- `extension/background.js`
- `extension/badge.js`
- `test/badge.test.mjs`

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
- `npm run verify` は成功し、Node標準テストは25件成功した。
- badge APIがrejectするテストでも未処理rejectは発生しなかった。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 完了条件の確認

- [x] `sendMessage` の抑制理由が公式仕様と一致する
- [x] badge APIのPromiseが未処理にならない
- [x] badge更新先がなくても未処理rejectが残らない
- [x] 型検査とテストが通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
