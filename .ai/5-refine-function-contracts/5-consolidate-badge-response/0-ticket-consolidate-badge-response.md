# Ticket: Consolidate Badge Response

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

5: badge反映の失敗分岐を集約する

## 目的

送信失敗と不正responseで重複するbadge消去処理をまとめる。

## 前提

- `chrome.runtime.lastError` は `sendMessage` のcallback内で読む。
- 送信失敗時はresponseをbadgeへ反映しない。
- 送信失敗と不正responseは、どちらも古いbadgeを消す。

## 対象範囲

- `extension/background.js`
- `test/background.test.mjs`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- badge表示仕様の変更
- sendMessage方式の変更
- 再送処理の追加

## 実行内容

- 送信失敗時の有効状態を `null` として扱う。
- badge消去の分岐を1つにする。
- 送信失敗がresponseより優先されることをテストする。

## 完了条件

- [x] `lastError` がある場合はresponseを反映しない
- [x] 不正responseではbadgeを消す
- [x] 正常responseではbadgeを更新する
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

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

- 送信失敗時の有効状態を `null` とし、不正responseと同じ分岐でbadgeを消すようにした。
- `lastError` と正常形式のresponseが同時にある場合も、responseを反映しないテストへ変更した。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/5-consolidate-badge-response/0-ticket-consolidate-badge-response.md`
- `extension/background.js`
- `test/background.test.mjs`

## 検証結果

- 構文検査と型検査は成功した。
- Node標準テストは29件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 完了条件の確認

- [x] `lastError` がある場合はresponseを反映しない
- [x] 不正responseではbadgeを消す
- [x] 正常responseではbadgeを更新する
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし。
