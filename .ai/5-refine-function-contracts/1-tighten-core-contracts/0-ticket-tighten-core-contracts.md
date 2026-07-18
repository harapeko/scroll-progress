# Ticket: Tighten Core Contracts

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

1: coreの公開契約と判定を絞る

## 目的

coreの公開APIをproduction利用箇所へ合わせ、toggle responseの値をbooleanへ限定する。

## 参照資料

- Grand Order: `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `content.js`, `background.js`, `badge.js`
- 型契約: `types/globals.d.ts`

## 前提

- message type定数は `createToggleMessage` と `isToggleMessage` の内部だけで使う。
- content scriptが作るresponseの `enabled` はbooleanである。
- `normalizeEnabled` はcontent側をbooleanへ絞れば他scriptから参照されない。
- `calculateProgress` はpure functionとして公開と直接テストを維持する。

## 対象範囲

- `extension/core.js`
- `extension/content.js`
- `test/core.test.mjs`
- `test/content.test.mjs`
- `test/background.test.mjs`
- `types/globals.d.ts`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- indicator DOM処理の移動
- event listener整理
- badge Promise処理
- message type文字列の変更

## 実行内容

- `TOGGLE_MESSAGE_TYPE` と `normalizeEnabled` をglobal APIから外す。
- `applyEnabled` をbooleanだけ受け取る関数へ変更する。
- toggle responseの作成、読み取り、badge表示をboolean契約へ揃える。
- object判定を早期returnで読みやすくする。
- 公開objectへproperty shorthandを適用する。
- 型宣言とテストを新しい契約へ合わせる。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] production未使用の定数と正規化関数が公開APIにない
- [x] responseの `enabled` はbooleanだけ受理される
- [x] content側の状態更新引数がbooleanである
- [x] 型検査とテストが通る

## 検証方法

- `rg -n "TOGGLE_MESSAGE_TYPE|normalizeEnabled" extension test types`
- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- message type定数をcore内部だけで使うようにした。
- 未使用になった `normalizeEnabled` を削除した。
- responseとbadge表示の引数をbooleanへ限定した。
- 不正な `enabled` をbackgroundで反映しないテストを追加した。
- core公開objectへproperty shorthandを適用した。
- 進捗値の範囲制限とindicator文字生成を読みやすくした。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/1-tighten-core-contracts/0-ticket-tighten-core-contracts.md`
- `extension/core.js`
- `extension/content.js`
- `test/background.test.mjs`
- `test/content.test.mjs`
- `test/core.test.mjs`
- `types/globals.d.ts`

## 検証結果

### 実行したコマンド

- `rg -n "TOGGLE_MESSAGE_TYPE|normalizeEnabled" extension test types`
- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `TOGGLE_MESSAGE_TYPE` はcore内部の作成と判定だけに残っている。
- `normalizeEnabled` は実行コード、テスト、型宣言からなくなった。
- `npm run typecheck` は成功した。
- Node標準テストは26件成功した。

## 完了条件の確認

- [x] production未使用の定数と正規化関数が公開APIにない
- [x] responseの `enabled` はbooleanだけ受理される
- [x] content側の状態更新引数がbooleanである
- [x] 型検査とテストが通る

## 未完了事項

- なし。
