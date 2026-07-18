# Ticket: Test Message State Boundaries

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

4: Strengthen Core Runtime Behavior

## 対象Mission

3: messageとON/OFFの境界値を確認する

## 目的

messageとresponseの不正値、およびfalse-onlyのON/OFF仕様を境界値テストで明示する。

## 参照資料

- Grand Order: `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `test/core.test.mjs`
- 利用箇所: `extension/content.js`, `extension/background.js`

## 前提

- 明示的な `false` だけを無効として扱う。
- `createToggleResponse` は必ずbooleanの `enabled` を返す。
- responseの `enabled: undefined` は不正responseとして扱う。
- objectでないmessageとtype不一致messageは無視する。

## 対象範囲

- `test/core.test.mjs`
- `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- このTicket

## 対象外

- message形式の変更
- `normalizeEnabled` の仕様変更
- runtime listenerの変更
- 公開API変更

## 実行内容

- `false`, `true`, `undefined`, `null` の正規化結果を確認する。
- object以外とtype欠落のmessageを確認する。
- `enabled` 欠落、undefined、nullを含むresponseを確認する。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- extension実行コード
- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] ON/OFFの4境界値がテストされる
- [x] 不正messageがfalseになる
- [x] 不正responseがnullになる
- [x] false-only仕様が維持される
- [x] 型検査とテストが通る

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `normalizeEnabled` と `createToggleResponse` に4つの境界値を追加した。
- type欠落、undefined、primitiveのmessageを追加した。
- `enabled` がundefinedまたはnullのresponseと、objectでないresponseを追加した。

## 変更ファイル

- `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- `.ai/4-strengthen-core-runtime-behavior/3-test-message-state-boundaries/0-ticket-test-message-state-boundaries.md`
- `test/core.test.mjs`

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
- `npm run verify` は成功し、Node標準テストは27件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 完了条件の確認

- [x] ON/OFFの4境界値がテストされる
- [x] 不正messageがfalseになる
- [x] 不正responseがnullになる
- [x] false-only仕様が維持される
- [x] 型検査とテストが通る

## 未完了事項

- なし。
