# Ticket: Ignore Node Modules

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

3: Eliminate JavaScript Analysis Warnings

## 対象Mission

2: JavaScript型検査の基盤を追加する

## 目的

型検査用依存のinstall先をGit管理対象から外す。

## 前提

- `npm install` 後の `node_modules/` が未追跡として表示された。
- 依存関係は `package.json` と `package-lock.json` で管理する。

## 対象範囲

- `.gitignore`
- このTicket

## 対象外

- package依存関係の変更
- extension実行コード

## 実行内容

- ルートの `node_modules/` を `.gitignore` へ追加する。

## 完了条件

- [x] `node_modules/` がGitの未追跡一覧に出ない
- [x] `package.json` と `package-lock.json` は管理対象のまま

## 検証方法

- `GIT_CONFIG_GLOBAL=/dev/null git status --short`

---

## 実行後ログ

## 実施内容

- `/.gitignore` に `/node_modules/` を追加した。

## 検証結果

- `node_modules/` はGitの未追跡一覧から外れた。
- package管理ファイルは変更一覧に残っている。

## 未完了事項

- なし。
