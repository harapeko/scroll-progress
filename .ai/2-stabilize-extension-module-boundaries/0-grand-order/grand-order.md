# Grand Order: Stabilize Extension Module Boundaries

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

2

## 目的

Scroll Progressの現在コードを、buildなしの構成を保ったまま、各scriptの責務と連携契約が読み取りやすい状態にする。

## 背景

- Grand Order 1で、Manifest V3対応、package生成、release workflow、ON/OFF機能、ファイル分割を進めた。
- 現在の拡張コードは `extension/core.js`, `indicator.js`, `content.js`, `badge.js`, `background.js` に分かれている。
- 各scriptは `globalThis` 上の名前で連携しているが、message形式、badge表示、indicator操作の境界はまだ暗黙的である。
- buildなしで保守する方針のため、読み込み順、公開API、テスト対象を明示しておく価値が高い。

## 要求のSOT

- 業務要件: 現在のコードを見て改善する。
- API仕様: Chrome Extensions Manifest V3。
- 外部IF: Chrome runtime messaging, action badge, content scripts。
- その他: 追加ライブラリやbuild導入は行わず、既存の軽量構成を維持する。

## 現在コードの観察

- `extension/content.js`
  - 表示状態のON/OFF、進捗更新、message受信、イベント登録を担っている。
  - `core.calculateDocumentProgress()` と `indicator` APIを呼ぶ形になっており、以前より薄くなっている。
  - ただし、content scriptの起動条件、message応答形式、イベント登録の責務はまだ同じ関数群に混在している。
- `extension/background.js`
  - action click、content scriptへのmessage送信、タブ更新時のbadge resetを担っている。
  - badge操作は `badge.js` に分かれたが、message失敗時の扱いとbadge resetの条件は暗黙的である。
- `extension/core.js`
  - 進捗計算、起動可否、ON/OFF値正規化、message type、選択除外style、throttleを持っている。
  - pure functionとDOM element向け処理が同居している。
- `extension/indicator.js`
  - indicator要素の生成、表示、非表示、表示値更新を担っている。
  - DOM APIに依存しており、現状はNode標準テストの直接対象ではない。
- `extension/badge.js`
  - Chrome action badgeの更新と消去を担っている。
  - Chrome APIに依存しており、現状はNode標準テストの直接対象ではない。

## 対象範囲

- `extension/` 配下のJavaScript
- `extension/manifest.json`
- `test/` 配下のNode標準テスト
- `scripts/build-zip.sh`
- 必要に応じたREADMEまたは管理資料

## 対象外

- TypeScript導入
- bundler導入
- 追加npm依存
- options page追加
- 永続的なON/OFF保存
- Chrome Web Storeの手動操作
- UIデザインの大幅変更

## 全体処理フロー

1. 現在のscript間連携を確認する。
2. 暗黙の契約を小さな関数や定数に寄せる。
3. pure functionとして切り出せるものからNode標準テストで固定する。
4. DOMやChrome APIに依存する部分は薄いadapterとして残す。
5. `npm run verify` とzip構造確認で公開可能性を維持する。

## 外部依存

- Chrome Extensions Manifest V3
- Chrome runtime messaging
- Chrome action badge
- Content scripts

## 制約

- buildなしで動く構成を維持する。
- `permissions` キーは追加しない。
- 生成zipはコミットしない。
- 既存の表示位置、表示文字、ON/OFFの基本挙動を不用意に変えない。
- 1つのMissionで複数の独立成果を混ぜない。

## 完了条件

- script間の主要な連携契約がコード上で読み取りやすい。
- pure functionとして固定できる判断がNode標準テストで確認されている。
- content scriptとservice worker本体が、Chrome APIやDOM APIの呼び出しを最小限に保っている。
- `npm run verify` が通る。
- `extension.zip` がChrome Web Store向け構造を維持している。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | runtime messageの契約を明示する | 完了 | なし | typeとresponse形を固定する |
| 2 | badge表示の判断をテスト可能にする | 完了 | Mission 1 | `OFF` 表示条件をpure function化する |
| 3 | indicator表示文字の生成をテスト可能にする | 完了 | なし | `progress + ' %'` を固定する |
| 4 | content scriptの起動処理を整理する | 完了 | Mission 1, 3 | イベント登録と状態更新を読みやすくする |
| 5 | service workerのmessage失敗時挙動を明示する | 完了 | Mission 1, 2 | content script不在タブの扱い |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 5は完了。Grand Order 2の完了条件を満たした。

## 未確定事項

- なし。

## 判断履歴

- Grand Order 1は公開・保守基盤復旧が主目的だったため、以後のコード境界整理はGrand Order 2として分ける。
- TypeScriptやbundlerは今回の改善対象にしない。現在の軽量なbuildなし構成を維持する。
- 追加permissionは今回の改善範囲では不要と判断する。
- Mission 1では、toggle messageとresponseの作成・判定を `core.js` に寄せ、Node標準テストで固定した。
- Mission 2では、badge表示文字の判断を `core.getBadgeText()` に寄せ、Node標準テストで固定した。
- Mission 3では、indicator表示文字の生成を `core.getIndicatorText()` に寄せ、初期表示と更新処理で共有した。
- Mission 4では、content scriptの起点を `start()` にまとめ、listener登録とruntime message処理を分けた。
- Mission 5では、正常responseだけbadgeへ反映し、送信失敗または不正responseでは古いbadgeを消す契約を固定した。
- content script不在時に新しいエラー表示は追加しない。現在状態を確認できないため、badgeを消すだけとする。
