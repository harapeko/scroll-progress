# Ticket: Limit Page Schemes

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、スキーマ、設定を確認すること。

## 対象Grand Order

10: Limit Content Script to Web Pages

## 対象Mission

1: content scriptをWebページだけに限定

## 目的

content scriptをHTTP/HTTPSページだけで実行する。

## 参照資料

- 要求のSOT: ユーザー指定の `*://*/*`
- API仕様: https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
- 現在状態: `extension/manifest.json`, `README.md`
- Grand Order: `.ai/10-limit-content-script-to-web-pages/0-grand-order/grand-order.md`
- 過去Ticket: なし

## 前提

- Chrome match patternの `*` schemeはHTTPとHTTPSに一致する。
- `file://` ページとChrome組み込みPDFビューアは対応対象に含めない。

## 対象範囲

- `extension/manifest.json`
- `test/manifest.test.mjs`
- `README.md`
- Grand Order 10
- このTicket

## 対象外

- JavaScript実装
- permissionと依存関係
- version更新
- packageの公開

## 実行内容

- content scriptのmatch patternを `<all_urls>` から `*://*/*` へ変更する。
- manifestのmatch patternを検証するテストを追加する。
- READMEへ対応schemeと対象外ページを記載する。

## 変更してよい範囲

- 対象範囲に記載したファイル

## 変更してはいけない範囲

- `extension/*.js`
- package依存関係
- Git tagとrelease workflow

## 完了条件

- [x] manifestのmatch patternが `*://*/*` だけである
- [x] manifestに `<all_urls>` が残っていない
- [x] match patternの回帰テストが通る
- [x] READMEにHTTP/HTTPS、`file://`、組み込みPDFビューアの扱いがある
- [x] 型検査と全テストが通る
- [x] 生成zipをコミットしない

## 検証方法

- `npm run typecheck`
- `npm run test`
- `npm run verify`
- `unzip -l extension.zip`
- `npm run clean`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- content scriptのmatch patternを `*://*/*` へ変更した。
- manifestを読む回帰テストを追加した。
- HTTP/HTTPSページだけで動作し、ローカルファイルとChrome組み込みPDFビューアは対象外であることをREADMEへ記載した。

## 変更ファイル

- `extension/manifest.json`
- `test/manifest.test.mjs`
- `README.md`
- Grand Order 10
- このTicket

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run test`
- `npm run verify`
- `unzip -l extension.zip`
- `unzip -p extension.zip manifest.json | rg -n 'matches|all_urls|\\*://\\*/\\*'`
- `npm run clean`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- 構文検査と型検査が成功した。
- 39件のテストが成功した。
- package内のmanifestが `*://*/*` であることを確認した。
- packageは拡張機能ファイル11件だけを含んでいた。
- 生成zipを削除した。
- whitespace errorはなかった。

## 完了条件の確認

- [x] すべて満たした。

## 未完了事項

- なし。

## 発見した問題

- なし。

## Ticket外として見送った事項

- `file://` ページへの対応は、今回の要求と反対になるため行わない。
- Chrome組み込みPDFビューアへの対応は、通常のcontent scriptとは実行環境が異なるため行わない。
- version更新と公開は、現在の `v1.1.0` 審査に影響させないため行わない。

## 次に必要なTicket

- なし。
