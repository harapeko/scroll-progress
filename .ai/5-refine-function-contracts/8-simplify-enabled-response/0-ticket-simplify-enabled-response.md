# Ticket: Simplify Enabled Response

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

8: enabled responseの読み取りを簡潔にする

## 目的

responseのobject判定とenabledの型判定を分け、property参照を1回にする。

## 前提

- responseがobjectでない場合は `null` を返す。
- `enabled` がbooleanの場合だけ値を返す。
- 欠落またはboolean以外の値は `null` を返す。

## 対象範囲

- `extension/core.js`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- response形式の変更
- 戻り値型の変更
- message処理の変更

## 実行内容

- object/null判定を先に行う。
- `Reflect.get` でenabledを1回だけ取得する。
- boolean判定の結果を返す。

## 完了条件

- [x] booleanのenabledをそのまま返す
- [x] 不正responseは `null` を返す
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

- responseのobject/null判定を先に行う形へ整理した。
- `Reflect.get` でenabledを1回だけ読み取るようにした。
- booleanだけを返し、それ以外は `null` とする契約を維持した。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/8-simplify-enabled-response/0-ticket-simplify-enabled-response.md`
- `extension/core.js`

## 検証結果

- 構文検査と型検査は成功した。
- Node標準テストは29件成功した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 未完了事項

- なし。
