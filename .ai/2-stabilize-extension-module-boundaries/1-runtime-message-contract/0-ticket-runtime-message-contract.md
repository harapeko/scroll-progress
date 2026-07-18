# Ticket: Runtime Message Contract

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

2: Stabilize Extension Module Boundaries

## 対象Mission

1: runtime messageの契約を明示する

## 目的

background scriptとcontent scriptのtoggle message契約を、直書きではなく共有関数として明示する。

## 参照資料

- 要求のSOT: ユーザー指示「go」
- Grand Order: `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `extension/background.js`, `extension/content.js`, `test/core.test.mjs`

## 前提

- 現在は `core.TOGGLE_MESSAGE_TYPE` を両側で直接使っている。
- content scriptのresponse形は `{ enabled: boolean }` だが、コード上の契約としては明示されていない。
- buildなしの構成なので、共有契約は `core.js` に置くのが最小差分。

## 対象範囲

- `extension/core.js`
- `extension/background.js`
- `extension/content.js`
- `test/core.test.mjs`
- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- このTicket

## 対象外

- messageの種類追加
- ON/OFF挙動の変更
- badge表示仕様の変更
- manifest変更
- 追加ライブラリ

## 実行内容

- `core.js` にtoggle message作成関数を追加する。
- `core.js` にtoggle message判定関数を追加する。
- `core.js` にtoggle response作成関数を追加する。
- `core.js` にresponseからenabledを読む関数を追加する。
- background/content scriptから新しい関数を使う。
- Node標準テストでmessage/response契約を固定する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] message typeの直書き判定がcontent scriptから消えている
- [x] background scriptが共有関数でmessageを作る
- [x] response形をテストで固定している
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `core.js` にtoggle message/response用の共有関数を追加した。
- background/content scriptから共有関数を使うようにした。
- Node標準テストでmessage/response契約を固定した。

## 変更ファイル

- `.ai/2-stabilize-extension-module-boundaries/0-grand-order/grand-order.md`
- `.ai/2-stabilize-extension-module-boundaries/1-runtime-message-contract/0-ticket-runtime-message-contract.md`
- `extension/background.js`
- `extension/content.js`
- `extension/core.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `npm run clean`
- `test ! -f extension.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは12件成功した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] message typeの直書き判定がcontent scriptから消えている
- [x] background scriptが共有関数でmessageを作る
- [x] response形をテストで固定している
- [x] `npm run verify` が通る
- [x] 生成zipをコミットしない

## 未完了事項

- なし
