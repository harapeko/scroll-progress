# Grand Order: Limit Content Script to Web Pages

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

10

## 目的

content scriptの実行対象を、Scroll Progressが対応するHTTP/HTTPSページに限定する。

## 背景

- 現在の `<all_urls>` は、HTTP/HTTPS以外に `file` schemeも対象にできる。
- 現在の機能は通常のWebページを対象としており、ローカルファイルでの動作を保証していない。
- 対応範囲をmanifestとREADMEで一致させる必要がある。

## 要求のSOT

- 業務要件: content scriptの対象を `*://*/*` に狭める。
- API仕様: Chrome Extensionsのmatch patterns。
- その他: `extension/manifest.json` と現在の実装。

## 対象範囲

- content scriptのmatch patternをHTTP/HTTPSだけにする。
- 対応するURLと対象外のページをREADMEへ記載する。
- match patternを回帰テストで固定する。

## 対象外

- hostを個別ドメインへ限定すること
- `file://` ページへの対応
- Chrome組み込みPDFビューアへの対応
- permission、依存関係、機能の追加
- version更新とリリース

## 全体処理フロー

1. ChromeがHTTP/HTTPSページにcontent scriptを挿入する。
2. content scriptが既存のindicator処理を開始する。
3. 対象外のschemeではcontent scriptを実行しない。

## 外部依存

- Chrome Extensions match patterns: https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns

新しいlibraryは追加しない。

## 制約

- content script以外の挙動を変更しない。
- 現在審査中の `v1.1.0` タグを変更しない。
- 生成zipをコミットしない。

## 完了条件

- content scriptのmatch patternが `*://*/*` である。
- `<all_urls>` がmanifestに残っていない。
- READMEから対応schemeと対象外ページを確認できる。
- 構文、型、全テスト、package生成の検証が成功する。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | content scriptをWebページだけに限定 | 完了 | なし | manifest、README、回帰テスト |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 1は完了。Grand Order 10の完了条件を満たした。

## 未確定事項

- なし。

## 判断履歴

- `*` schemeはHTTPとHTTPSに一致するため、要求どおり `*://*/*` を使用する。
- ローカルファイルとChrome組み込みPDFビューアは現在の対応範囲に含めない。
- hostの個別制限は拡張機能の用途を損なうため行わない。
- Mission 1では、match patternをmanifest、回帰テスト、READMEで一致させた。
