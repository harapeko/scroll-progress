# Grand Order: Support Diverse Scroll Layouts

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

6

## 目的

document全体、固定shell内のscroll area、複数ペイン、標準Fullscreenを使うページで、邪魔にならず現在操作中の縦スクロール進捗を表示する。

## 背景

- 現在は `document.scrollingElement` とwindowのscroll eventだけを使う。
- `body` が `overflow: auto` のページは起動時に除外している。
- 固定shell内のelement scrollはwindowへscroll eventが届かず、進捗を表示できない。
- indicatorは左下固定のため、Fullscreen対象に含まれる場合は動画やコンテンツへ重なる。
- READMEの非対応例は古く、現在の対応範囲を判断しにくい。

## 要求のSOT

- 業務要件: 多様なlayoutへ対応し、動画最大化時にindicatorが邪魔にならないこと。
- API仕様: CSSOM View Module、DOM Standard、Fullscreen API Standard。
- 現在状態: `extension/content.js`, `core.js`, `indicator.js`, `test/*.mjs`, `README.md`。
- 文書要件: 対応layoutをREADMEへ記載し、図で判定フローを示すこと。

## 対象範囲

- document viewportの縦スクロール
- `body` またはnested elementの縦スクロール
- 複数scroll areaでは最後に操作された対象
- viewport resize後の再計算
- Fullscreen API利用中のindicator非表示と解除後の復帰
- READMEの対応表とMermaid図

## 対象外

- 横スクロール進捗
- cross-origin iframe
- closed shadow root内のscroll area
- CSSだけで作られたサイト独自の疑似fullscreen判定
- F11によるブラウザUIのfullscreen判定
- ページ固有selectorまたはサイト別処理
- 複数indicatorの同時表示

## 全体処理フロー

1. 起動時はdocumentのscroll sourceを使う。
2. scroll eventのtargetから、現在操作中のscroll sourceを更新する。
3. sourceのscrollTop、scrollHeight、viewport heightから進捗を計算する。
4. Fullscreen中またはsourceがスクロールできない場合はindicatorを隠す。
5. resize、scroll、Fullscreen解除時に再計算する。
6. 対応範囲と制約をREADMEへ図示する。

## 外部依存

- CSSOM View Module: https://www.w3.org/TR/cssom-view/
- DOM Standard: https://dom.spec.whatwg.org/
- Fullscreen API Standard: https://fullscreen.spec.whatwg.org/

新しいlibraryは追加しない。

## 制約

- permissionを追加しない。
- build toolやruntime依存を追加しない。
- pollingや全DOM走査を行わない。
- ページのscroll、focus、pointer操作を妨げない。
- indicatorのtoggleとbadge契約を維持する。
- 生成zipをコミットしない。

## 完了条件

- document viewportの進捗を既存どおり表示できる。
- body/nested elementの縦スクロール進捗を表示できる。
- 複数ペインでは最後にscrollされた対象へ追随する。
- Fullscreen中はindicatorを表示せず、解除後に復帰する。
- resize後に現在sourceの進捗を再計算する。
- 対応layout、非対応範囲、判定フローがREADMEにある。
- 構文、型、テスト、package生成の検証が成功する。
- permissionと依存関係が増えない。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | Fullscreen中の非表示と復帰 | 完了 | なし | 標準Fullscreen API |
| 2 | documentとelementの進捗計算を共通化 | 完了 | Mission 1 | 純粋なmetrics処理 |
| 3 | 操作中のscroll areaへ追随 | 完了 | Mission 2 | capture phaseを使用 |
| 4 | layout変化時の再計算 | 完了 | Mission 3 | resizeと非scrollable化 |
| 5 | READMEへ対応layoutを図示 | 完了 | Mission 1-4 | 対応表とMermaid |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 5は完了。Grand Order 6の完了条件を満たした。

## 未確定事項

- element scrollのtargetを切り替える条件は、Mission 2と3で実際のevent契約を確認して決める。
- CSS疑似fullscreenは標準状態がないため、誤検知しない方法が見つかるまで対象外とする。

## 判断履歴

- Fullscreen APIには `fullscreenElement` と `fullscreenchange` があるため、サイト固有判定を使わない。
- elementの候補を起動時に全走査せず、実際のscroll eventから追跡する。
- 複数ペインへindicatorを複製せず、最後に操作されたsourceを表示する。
- Mission 1では、Fullscreen開始時にindicatorを外し、解除後に現在進捗へ復帰するようにした。
- Mission 2では、documentの既存計算を維持し、elementの `clientHeight` を使う計算を追加した。
- Mission 3では、scroll eventをcaptureし、最後に操作されたElementを進捗sourceとして追跡するようにした。
- Mission 4では、resize時に再計算し、source切断と非scrollable化で古い表示を残さないようにした。
- Mission 5では、対応layoutとsource判定をREADMEの表とMermaid図へ反映した。
