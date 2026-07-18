# Grand Order: Stabilize Indicator Appearance

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

8

## 目的

ページの文字色、font、writing mode、共通CSSに影響されず、indicatorを同じ見た目で読めるようにする。

## 背景

- indicatorは背景色を指定しているが文字色を指定していない。
- `body` の文字色が白いページでは、薄い背景上の文字が読みにくくなる可能性がある。
- inline styleで主要propertyは指定しているが、fontやdirectionなどはページから継承する。
- content scriptのJavaScript環境は分離されるが、追加したDOMはページと共有される。

## 要求のSOT

- 業務要件: 多様なlayoutでindicatorが読めること。
- API仕様: CSS Cascading and Inheritance。
- 外部IF: Chrome Extensions content scripts。
- その他: `extension/indicator.js` の現在実装とテスト。

## 対象範囲

- indicator styleの継承を初期値へ戻す。
- 文字色、font、direction、box sizingを明示する。
- 現在の位置、寸法、操作非干渉を維持する。
- style契約をテストする。

## 対象外

- Shadow DOM化
- ページ側の `!important` への対抗
- indicatorの表示位置、色、font sizeの設定機能
- screenshotとREADMEの更新

## 全体処理フロー

1. indicator elementを作る。
2. `all: initial` で継承と通常の共通styleを戻す。
3. indicator固有の位置、色、font、方向、box modelを設定する。
4. 現在どおりbodyへ追加し、進捗文字を更新する。

## 外部依存

- Chrome content scripts: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
- CSS Cascading and Inheritance: https://www.w3.org/TR/css-cascade-5/

新しいlibraryは追加しない。

## 制約

- permissionと依存関係を追加しない。
- indicatorの公開APIを変更しない。
- pointer eventとtext selectionを妨げない現在契約を維持する。
- 生成zipをコミットしない。

## 完了条件

- ページの文字色を継承しない。
- font、direction、box sizingがindicator側で確定する。
- 位置、背景、border、pointer event、user selectionの既存styleを維持する。
- indicatorの公開APIを維持する。
- 構文、型、全テスト、package生成の検証が成功する。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | indicator styleの継承を遮断 | 完了 | なし | 通常のpage CSSを対象 |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 1は完了。Grand Order 8の完了条件を満たした。

## 未確定事項

- `!important` による上書きが実際に確認された場合は、Shadow DOMを別Grand Orderで評価する。

## 判断履歴

- 通常のCSS継承を止めるにはShadow DOMより小さい変更で足りるため、まずinline styleを初期化する。
- 表示内容は数値とpercentだけなので、directionは左から右へ固定する。
- Mission 1では、`all: initial` とindicator固有styleによってpage CSSの継承を止めた。
