# Ticket: Add JavaScript Typecheck

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

3: Eliminate JavaScript Analysis Warnings

## 対象Mission

2: JavaScript型検査の基盤を追加する

## 目的

Chrome Extensions APIとNode組み込みAPIを認識するJavaScript型検査を、リポジトリ内で再現できるようにする。

## 参照資料

- 要求のSOT: ユーザーから提示されたWebStorm警告
- Grand Order: `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- 既存例: Tweet Pageの `tsconfig.json`, `package.json`
- 現在状態: `extension/*.js`, `test/*.mjs`, `package.json`

## 前提

- extension本体はJavaScriptのまま維持する。
- 型情報とcompilerは開発時だけ使用する。
- Node.jsは20以上を対象とする。
- global script連携の型は次のMissionで定義する。

## 対象範囲

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- このTicket

## 対象外

- extensionコードの型警告修正
- VM fixtureのIDE警告修正
- TypeScriptへの書き換え
- 実行時依存追加

## 実行内容

- TypeScript、Chrome型、Node型をdevDependenciesへ追加する。
- JavaScriptと `.mjs` を対象にした `tsconfig.json` を追加する。
- `npm run typecheck` を追加する。
- `npm run verify` に型検査を組み込む。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- extension実行コード
- manifest
- 生成zip

## 完了条件

- [x] Chrome型とNode型がdevDependenciesにある
- [x] JavaScript型検査設定がリポジトリにある
- [x] `npm run typecheck` が実行できる
- [x] 型検査が `npm run verify` に含まれる
- [x] runtime dependenciesが増えていない

## 検証方法

- `npm ls --depth=0`
- `npm run typecheck`
- `npm audit --omit=dev`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- `@types/chrome`, `@types/node`, TypeScriptをdevDependenciesへ追加した。
- `checkJs` を有効にした `tsconfig.json` を追加した。
- `npm run typecheck` を追加し、`npm run verify` に組み込んだ。

## 変更ファイル

- `.ai/3-eliminate-javascript-analysis-warnings/0-grand-order/grand-order.md`
- `.ai/3-eliminate-javascript-analysis-warnings/2-add-javascript-typecheck/0-ticket-add-javascript-typecheck.md`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

## 検証結果

### 実行したコマンド

- `npm ls --depth=0`
- `npm run typecheck`
- `npm audit --omit=dev`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- Chrome型、Node型、TypeScriptがdevDependenciesとして解決された。
- global APIとfixtureの型追加後、`npm run typecheck` は成功した。
- runtime dependenciesは0件のまま。
- runtime dependenciesを対象とした監査は脆弱性0件だった。

## 完了条件の確認

- [x] Chrome型とNode型がdevDependenciesにある
- [x] JavaScript型検査設定がリポジトリにある
- [x] `npm run typecheck` が実行できる
- [x] 型検査が `npm run verify` に含まれる
- [x] runtime dependenciesが増えていない

## 未完了事項

- なし。
