# Grand Order: Mount Indicator at Document Root

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

9

## 目的

`body` の有無やtransformに影響されず、indicatorをviewport基準で表示できるようにする。

## 背景

- indicatorは `position: fixed` だが、現在は `body` の子として追加している。
- transformが指定された要素は、fixed-positionの子孫に対するcontaining blockになる。
- `document.body` は常に存在するとは限らない。

## 要求のSOT

- 業務要件: 多様なlayoutでindicatorが安定して表示されること。
- API仕様: CSS Transforms、HTML Standard。
- その他: `extension/indicator.js` の現在実装とテスト。

## 対象範囲

- indicatorの追加先を `document.documentElement` にする。
- `body` を参照せず表示できることをテストする。

## 対象外

- Shadow DOM化
- ページ側の `!important` への対抗
- indicatorの表示位置や見た目の変更
- iframe、shadow root内への表示

## 全体処理フロー

1. indicator elementを作る。
2. 表示時にdocument elementへ追加する。
3. 非表示時は現在どおりDOMから外す。

## 外部依存

- CSS Transforms: https://www.w3.org/TR/css-transforms-1/#transform-rendering
- HTML Standard: https://html.spec.whatwg.org/multipage/dom.html#dom-document-body

新しいlibraryは追加しない。

## 制約

- permissionと依存関係を追加しない。
- indicatorの公開APIを変更しない。
- 現在のstyleと表示切替を維持する。
- 生成zipをコミットしない。

## 完了条件

- indicatorが `body` を参照せず表示される。
- `body` がないテスト環境でも表示処理が成功する。
- indicatorの公開APIとstyleを維持する。
- 構文、型、全テスト、package生成の検証が成功する。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | indicatorをdocument elementへ追加 | 完了 | なし | `body` 依存を除去 |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 1は完了。Grand Order 9の完了条件を満たした。

## 未確定事項

- なし。

## 判断履歴

- `body` のtransformを個別に検査するより、indicatorの追加先をdocument elementへ固定する方が単純である。
- `body` への追加を前提にしないため、`body` が存在しない文書でも同じ処理を使う。
- Mission 1では、既存styleと公開APIを変えずに追加先だけをdocument elementへ移した。
