# Grand Order: Strengthen Active Scroll Tracking

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

7

## 目的

横scrollやelement単体のresizeがあるlayoutでも、現在読んでいる縦scroll areaの進捗を安定して表示する。

## 背景

- 現在はscroll eventのtargetがElementなら、縦scroll rangeの有無を確認せずactive sourceにする。
- 横方向だけのcarouselを操作すると進捗が計算できず、indicatorが消える。
- window resizeには追随するが、paneやsidebarだけがresizeした場合は次のscrollまで再計算しない。
- READMEのiframeとshadow rootに関する制約が、現在実装より狭く書かれている。

## 要求のSOT

- 業務要件: 多様なlayoutへ耐久できるようにする。
- API仕様: CSSOM View Module、DOM Standard、Resize Observer。
- 外部IF: Chrome Extensions content scripts manifest。
- その他: Grand Order 6で確定したactive scroll source契約。

## 対象範囲

- 縦scroll rangeがあるElementだけをactive sourceにする。
- 横方向だけのscroll targetでは現在sourceを維持する。
- active elementを1件だけResizeObserverで監視する。
- active elementのresize、切断、非表示後に再計算する。
- READMEの対応表、判定フロー、制約を現在実装へ合わせる。

## 対象外

- iframe内の進捗表示
- shadow root内の進捗表示
- 複数indicatorの表示
- scrollがユーザー操作かscript実行かの判定
- indicatorのShadow DOM化または表示位置設定

## 全体処理フロー

1. Documentのscrollはdocument sourceへ戻す。
2. Elementのscrollは縦scroll rangeがある場合だけactive sourceにする。
3. 横方向だけのscrollは現在sourceを変えない。
4. active elementをResizeObserverへ登録する。
5. source変更時は以前のelementを監視解除する。
6. element resize時に接続状態と進捗を再計算する。

## 外部依存

- CSSOM View Module: https://www.w3.org/TR/cssom-view/
- DOM Standard: https://dom.spec.whatwg.org/
- Resize Observer: https://www.w3.org/TR/resize-observer/
- Chrome content scripts: https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts

新しいlibraryは追加しない。

## 制約

- permissionを追加しない。
- polling、全DOM走査、MutationObserverを追加しない。
- ResizeObserverはactive element 1件だけを監視する。
- toggle、badge、Fullscreenの契約を維持する。
- 生成zipをコミットしない。

## 完了条件

- 横方向だけのscrollでactive sourceが変わらない。
- 縦scroll elementの既存追随を維持する。
- active elementのresize後に進捗を再計算する。
- source変更時に監視対象が切り替わる。
- element切断または非表示後に古い進捗を残さない。
- READMEの対応範囲と制約が実装に一致する。
- 構文、型、テスト、package生成の検証が成功する。
- permissionと依存関係が増えない。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | 縦scroll sourceだけを選択 | 完了 | なし | 横scrollは現在sourceを維持 |
| 2 | active elementのresizeを監視 | 完了 | Mission 1 | 監視対象は1件 |
| 3 | READMEの対応契約を訂正 | 進行中 | Mission 1, 2 | iframeとshadow rootを含む |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 3を実施中。READMEの対応表と制約を現在実装へ合わせる。

## 未確定事項

- ResizeObserver開始直後の通知は、既存throttleで重複更新を抑える。

## 判断履歴

- 横scroll対応そのものは対象外だが、横scrollが縦進捗を壊さないようにする。
- element resizeはwindow resizeでは検知できないため、active elementだけResizeObserverで監視する。
- iframe対応はframe間の表示とtoggle契約が別成果になるため対象外とする。
- Mission 1では、縦scroll rangeがないElementのscroll eventで現在sourceを変えないようにした。
- Mission 2では、active element 1件だけをResizeObserverで監視し、source変更時に監視を切り替えるようにした。
