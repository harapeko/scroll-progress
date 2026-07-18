# Grand Order: Strengthen Core Runtime Behavior

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

4

## 目的

`core.js` の進捗計算とthrottleを、Web APIの仕様と境界テストで確認できる状態にする。

## 背景

- `calculateDocumentProgress` は `scrollingElement.scrollTop` と `body.scrollHeight` を組み合わせている。
- `throttle` は実運用されているが、leading、trailing、timer解除を直接確認するテストがない。
- 外部レビュー案には構文変更やES Modules化も含まれるが、buildなしの構成と公開APIを維持する。

## 要求のSOT

- 業務要件: 提示されたレビュー観点から、必要性の高い改善だけを採用する。
- API仕様: CSSOM View Moduleの `Document.scrollingElement`, `Element.scrollHeight`。
- 実行条件: Chrome Extensions Manifest V3、既定の `document_idle`。
- 現在状態: `extension/core.js`, `content.js`, `test/core.test.mjs`, `types/globals.d.ts`。

## 現在コードの観察

- 進捗位置は `scrollingElement` から読む一方、高さは常に `body` から読んでいる。
- `scrollingElement` がない場合は `documentElement` へ戻す処理がある。
- `throttle` は先頭を即時実行し、待機中の呼び出しを末尾で1回実行する。
- messageとresponseの `unknown` 検査は、値を読む前にobjectとnullを確認している。
- 小さな公開関数はscript間の契約またはテスト可能な判断として利用されている。

## 対象範囲

- `extension/core.js`
- `test/core.test.mjs`
- `types/globals.d.ts`
- 必要な管理資料

## 対象外

- ES Modules化
- TypeScript化
- アロー関数への一括置換
- 公開APIの追加または削除
- message契約とON/OFF仕様の変更
- 依存関係の追加

## 全体処理フロー

1. スクロール主体の位置と高さを同じelementから取得する。
2. JSDocと型宣言を実際に読むプロパティへ合わせる。
3. throttleの時間境界を偽時計で固定する。
4. 構文、型、テスト、zip生成を検証する。

## 外部依存

- CSSOM View Module: <https://drafts.csswg.org/cssom-view/#dom-document-scrollingelement>
- CSSOM View Module: <https://drafts.csswg.org/cssom-view/#dom-element-scrollheight>
- Chrome content scripts: <https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#run_time>

## 制約

- `globalThis.ScrollProgressCore` の公開方法と公開APIを維持する。
- 現在のleading/trailing動作を変えない。
- buildと実行時依存を追加しない。
- 生成zipはコミットしない。

## 完了条件

- スクロール位置と全体高が同じscrolling elementから計算される。
- `scrollingElement` がない場合のfallbackが維持される。
- throttleのleading、trailing、連続呼び出し、timer解除がテストされる。
- `npm run typecheck` と `npm run verify` が成功する。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | スクロール主体の寸法で進捗を計算する | 完了 | なし | JSDocと型宣言を含む |
| 2 | throttleの時間境界を固定する | 未着手 | Mission 1 | 偽時計によるテスト |

## 現在のMission

Mission 1は完了。次はMission 2を実行する。

## 未確定事項

- なし。

## 判断履歴

- `scrollingElement` はviewportのスクロールAPIに使うelementとして仕様化されているため、位置と高さを同じelementから読む。
- `document.body` のnull guardは追加しない。現在のmanifestではcontent scriptが既定の `document_idle` で動き、DOM完成後に実行される。
- ES Modules化は読み込み方式と公開契約を変えるため見送る。
- アロー関数化とproperty shorthandだけの変更は、このGrand Orderの成果に含めない。
- message検査と `normalizeEnabled` は現在のテストとfalse-only仕様が一致しているため変更しない。
- Mission 1では、選択したscrolling elementの位置と高さを組にして進捗を計算するようにした。
