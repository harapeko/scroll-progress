# Ticket: Bind Action Tab ID

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

6: action tab IDのbindingを簡潔にする

## 目的

action handler内のtab ID移し替えをなくし、callbackまで使う数値IDを引数で固定する。

## 前提

- action handlerは `chrome.tabs.Tab` の `id` だけを使う。
- tab IDが数値でない場合はmessageを送らない。
- badge反映と送信失敗の処理は変更しない。

## 対象範囲

- `extension/background.js`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- `lastError` 処理の移動
- callback形式の変更
- テスト仕様の変更

## 実行内容

- action handlerの引数から `id` を `tabId` として受け取る。
- `const tabId = tab.id` を削除する。

## 完了条件

- [x] tab IDの数値判定が維持される
- [x] 数値IDがcallbackまで固定される
- [x] 型検査と全テストが通る
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

## 実施内容

- action handlerの引数で `id` を `tabId` として受け取るようにした。
- handler内の `const tabId = tab.id` を削除した。
- `lastError` とbadge反映の処理は変更しなかった。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/6-bind-action-tab-id/0-ticket-bind-action-tab-id.md`
- `extension/background.js`

## 検証結果

- 構文検査と型検査は成功した。
- Node標準テストは29件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 未完了事項

- なし。
