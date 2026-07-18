# Ticket: Type Global Contracts

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

3: Eliminate JavaScript Analysis Warnings

## 対象Mission

3: global APIとVM fixtureの型警告を解消する

## 目的

buildなしで連携するglobal APIと、VMテストへ渡すfixtureの型を明示する。

## 参照資料

- 要求のSOT: ユーザーから提示されたWebStorm警告
- Grand Order: `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- Mission 2で追加した `tsconfig.json`
- `npm run typecheck` の実行結果

## 前提

- `ScrollProgressCore`, `ScrollProgressIndicator`, `ScrollProgressBadge` は実行時に `globalThis` へ公開される。
- VMテストのcontext内プロパティは、評価対象scriptから動的に参照される。
- TypeScriptへの書き換えやmodule化は行わない。

## 対象範囲

- `extension/` 配下のJavaScript
- `test/` 配下のNode標準テスト
- `types/globals.d.ts`
- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- このTicket

## 対象外

- extensionの機能変更
- manifest変更
- runtime dependencies追加

## 実行内容

- global APIのinterfaceとglobal変数を宣言する。
- `unknown` のmessageとresponseを利用前に絞り込む。
- Chrome callback内で確定済みtab IDを保持する。
- VM fixtureの引数、配列、listenerを型付けする。
- 動的参照に対するIDE抑制を必要箇所だけに付ける。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 生成zip
- package依存関係
- 画像アセット

## 完了条件

- [x] global APIが型として定義されている
- [x] Chrome APIを使うJavaScriptの型検査が通る
- [x] Node VMテストの型検査が通る
- [x] IDE抑制が動的参照箇所に限定されている
- [x] `npm run typecheck` が成功する

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `types/globals.d.ts` に3つのglobal APIを定義した。
- messageとresponseを利用前に絞り込むようにした。
- Chrome callbackで確定済みのtab IDを保持するようにした。
- VM fixtureのlistener、引数、記録用配列を型付けした。
- WebStormの未使用判定を抑える箇所を動的参照部分だけに限定した。

## 変更ファイル

- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- `.ai/3-eliminate-javascript-analysis-warnings/3-type-global-contracts/0-ticket-type-global-contracts.md`
- `extension/background.js`
- `extension/badge.js`
- `extension/core.js`
- `extension/indicator.js`
- `test/background.test.mjs`
- `test/content.test.mjs`
- `test/core.test.mjs`
- `types/globals.d.ts`

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
- `npm run verify` は成功し、Node標準テストは22件成功した。
- zipはextension実行ファイルと画像だけを含み、型宣言とdevDependenciesは含まれなかった。
- 生成zipは削除済み。

## 完了条件の確認

- [x] global APIが型として定義されている
- [x] Chrome APIを使うJavaScriptの型検査が通る
- [x] Node VMテストの型検査が通る
- [x] IDE抑制が動的参照箇所に限定されている
- [x] `npm run typecheck` が成功する

## 未完了事項

- なし。
