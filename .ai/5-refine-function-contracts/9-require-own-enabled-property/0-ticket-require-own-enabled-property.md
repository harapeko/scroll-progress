# Ticket: Require Own Enabled Property

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

5: Refine Function Contracts

## 対象Mission

9: enabledをown propertyに限定する

## 目的

外部境界で受け取るresponseについて、response自身が持つenabledだけを受理する。

## 前提

- Chrome messagingのresponseはcontent scriptから受け取る外部入力として検証する。
- enabledがbooleanの場合だけbadge状態へ反映する。
- TypeScriptのtargetはES2022である。

## 対象範囲

- `extension/core.js`
- `test/core.test.mjs`
- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- このTicket

## 対象外

- response形式の変更
- Proxyへの特別対応
- 汎用validation helperの追加

## 実行内容

- `Object.hasOwn` でenabledの所有を確認する。
- prototype上のenabledを拒否するテストを追加する。
- 値の取得とboolean判定は既存処理を使う。

## 完了条件

- [x] own propertyのbooleanを受理する
- [x] prototype上のenabledを拒否する
- [x] 不正responseを引き続き拒否する
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

- `Object.hasOwn` でresponse自身がenabledを持つことを確認するようにした。
- prototype上のenabledを拒否するテストを追加した。
- 値の取得とboolean判定には既存の `Reflect.get` を使用した。

## 変更ファイル

- `.ai/5-refine-function-contracts/0-grand-order/grand-order.md`
- `.ai/5-refine-function-contracts/9-require-own-enabled-property/0-ticket-require-own-enabled-property.md`
- `extension/core.js`
- `test/core.test.mjs`

## 検証結果

- 構文検査と型検査は成功した。
- Node標準テストは29件成功した。
- prototype上のenabledが `null` になることを確認した。
- zipにはextension実行ファイルと既存画像だけが含まれていた。
- 生成zipは削除済み。

## 未完了事項

- なし。
