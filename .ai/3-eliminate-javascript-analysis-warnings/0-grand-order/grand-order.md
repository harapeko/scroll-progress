# Grand Order: Eliminate JavaScript Analysis Warnings

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

3

## 目的

WebStormとリポジトリ内の型検査が、extensionコードとNodeテストの実行環境を正しく認識できる状態にする。

## 背景

- extensionコードにはES5時代の `var` が残っている。
- Chrome Extensions APIの型情報がリポジトリにないため、`chrome` と配下APIが未解決になる。
- Nodeの型情報がないため、テスト内の `node:fs`, `node:vm`, `node:assert` のAPIが未解決になる。
- buildなしのglobal script連携とVMテストのfixtureは、静的解析から利用箇所が見えにくい。
- IDE固有設定だけで解消すると、別環境やCIで同じ解析結果を再現できない。

## 要求のSOT

- 業務要件: ユーザーから提示されたJavaScript警告を解消する。
- API仕様: Chrome Extensions Manifest V3、Node.js 20以上。
- 現在状態: `extension/`, `test/`, `package.json`, `package-lock.json`。
- 既存方針: buildなしで保守しやすい構成を維持する。

## 現在コードの観察

- `extension/*.js`
  - 再代入しない変数にも `var` が使われている。
  - `globalThis` 経由で公開するAPIの型契約がない。
  - `chrome` の型情報がない。
- `test/*.mjs`
  - Node組み込みAPIの型情報がない。
  - VMへ渡す関数は動的に参照されるため、IDEが未使用と判定する箇所がある。
- `package.json`
  - 構文検査とテストはあるが、型検査のscriptがない。
  - 実行時依存はない。

## 対象範囲

- `extension/` 配下のJavaScript
- `test/` 配下のNode標準テスト
- `package.json`, `package-lock.json`
- 型検査設定と型宣言
- 必要な管理資料

## 対象外

- TypeScriptへの書き換え
- bundler導入
- extensionの実行時依存追加
- 機能変更
- manifestのpermission変更
- UI変更

## 全体処理フロー

1. `var` を再代入有無に合わせて `const` または `let` へ置き換える。
2. ChromeとNodeの型情報、JavaScript型検査設定を追加する。
3. buildなしのglobal APIを型宣言で接続する。
4. VM fixtureに必要な型または限定的なIDE指示を付ける。
5. 構文、型、テスト、zip生成をまとめて検証する。

## 外部依存

- `@types/chrome`
- `@types/node`
- TypeScript compilerの `checkJs`

いずれも開発時だけ使用し、extension.zipには含めない。

## 制約

- extension本体はJavaScriptのまま維持する。
- buildなしでChromeが直接読み込める構成を維持する。
- 型検査のために実行時コードを複雑化しない。
- IDEの誤検知抑制は、動的参照される箇所だけに限定する。
- 生成zipはコミットしない。

## 完了条件

- `extension/` 配下に `var` が残っていない。
- Chrome Extensions APIとNode組み込みAPIの型が解決される。
- global script間の公開APIが型として定義される。
- `npm run typecheck` が成功する。
- `npm run verify` が成功する。
- extension.zipに開発用依存や型宣言が混入しない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | `var` を `const` と `let` へ置き換える | 完了 | なし | 実行挙動は変えない |
| 2 | JavaScript型検査の基盤を追加する | 完了 | Mission 1 | Chrome/Node型とtypecheck script |
| 3 | global APIとVM fixtureの型警告を解消する | 完了 | Mission 2 | 通しの検証を含む |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 3は完了。Grand Order 3の完了条件を満たした。

## 未確定事項

- なし。

## 判断履歴

- IDE側だけのライブラリ設定ではなく、リポジトリ内で再現できる型検査を採用する。
- 型情報とcompilerはdevDependenciesとし、extensionの実行物には含めない。
- Tweet Pageで利用中の `checkJs` 構成を基準にし、Scroll Progressのglobal script構成へ合わせる。
- Mission 1では、再代入しない値を `const`、状態を持つ値を `let` へ置き換えた。
- Mission 2では、Chrome型、Node型、TypeScriptをdevDependenciesとして追加し、`npm run typecheck` を検証へ組み込んだ。
- Mission 3では、global APIの型宣言とVM fixtureの型を追加した。
- 動的参照に対する `noinspection` は、global APIの公開3か所とVM fixtureの3か所だけに限定した。
- 当初のMission 4は独立した成果ではないため、Mission 3の完了検証へ統合した。
