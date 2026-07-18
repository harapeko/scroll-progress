# Ticket: Update Scroll Tracking Contract

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

7: Strengthen Active Scroll Tracking

## 対象Mission

3: READMEの対応契約を訂正

## 目的

READMEの対応layout、source選択、非対応範囲を現在実装と一致させる。

## 参照資料

- 要求のSOT: Grand Order 7
- API仕様: https://www.w3.org/TR/resize-observer/
- 外部IF: https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts
- 現在状態: `extension/content.js`, `extension/manifest.json`, `README.md`
- Grand Order: `.ai/7-strengthen-active-scroll-tracking/0-grand-order/grand-order.md`
- 過去Ticket: `.ai/7-strengthen-active-scroll-tracking/2-observe-active-element/0-ticket-observe-active-element.md`

## 前提

- active elementのresizeはResizeObserverで再計算する。
- 横方向だけのscroll targetでは現在sourceを維持する。
- content scriptはtop frameだけへ注入される。
- shadow root内へscroll listenerを登録していない。

## 対象範囲

- `README.md`
- Grand Order 7
- このTicket

## 対象外

- extensionの挙動変更
- iframe、shadow rootへの対応
- screenshot更新

## 実行内容

- active pane resizeを対応表と判定フローへ追加する。
- 横方向だけのscrollではsourceを維持することを記載する。
- iframeとshadow root内のscroll areaを非対応と記載する。
- Resize ObserverとChrome content scripts仕様へリンクする。

## 変更してよい範囲

- 対象範囲に記載したファイル

## 変更してはいけない範囲

- extension、test、manifest、依存関係

## 完了条件

- [x] active pane resizeの動作が記載されている
- [x] 横scroll targetの扱いが記載されている
- [x] iframeとshadow rootの制約が現在実装に一致する
- [x] 実装根拠へのリンクがある
- [x] Markdown差分に問題がない

## 検証方法

- `README.md` の表とMermaid構文を確認する
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- active pane resizeを対応表と判定フローへ追加した。
- 縦scroll rangeがあるElementだけをsourceにすることを記載した。
- iframeとshadow root内のscroll areaを非対応と明記した。
- Resize ObserverとChrome content scripts manifestへリンクした。

## 変更ファイル

- `README.md`
- Grand Order 7
- このTicket

## 検証結果

### 実行したコマンド

- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`
- `rg -n "Active pane resize|Horizontal-only|iframes|shadow roots|Resize Observer|flowchart" README.md`

### 結果

- whitespace errorはなかった。
- 表、Mermaid、制約、参照リンクの記載を確認した。

## 完了条件の確認

- [x] すべて満たした。

## 未完了事項

- なし。

## 発見した問題

- なし。

## Ticket外として見送った事項

- iframe、shadow rootへの対応は別成果とする。
- indicatorのCSS隔離は別のGrand Order候補とする。

## 次に必要なTicket

- なし。
