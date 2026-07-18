# Grand Order: Restore Maintainable Release Flow

## この文書の位置付け

この文書は、Scroll Progressを現在のChrome拡張要件に合わせて保守しやすくするための作業管理資料である。現在状態はソースコード、設定、実行結果を確認して判断する。

## チケット番号

1

## 目的

Scroll Progressを、手作業zipに依存せず検証・パッケージできる状態にする。そのうえで、必要な保守改善を小さなMissionで積み上げられるようにする。

## 背景

- Chrome Web Store上でScroll Progressも更新対象になっている。
- 別リポジトリで、生成zipの追跡、手作業パッケージ、検証コマンド不足が後戻りの原因になった。
- このリポジトリには `.ai` と `AGENTS.md` がまだない。

## 要求のSOT

- 業務要件: ここまでの作業で活かせた改善をScroll Progressにも適用する。
- API仕様: Chrome Extensions Manifest V3。
- 外部IF: Chrome Web Store。
- その他: 既存プロダクト挙動を不用意に変えない。

## 対象範囲

- AI作業管理資料
- zip生成手順
- 検証コマンド
- 生成物の追跡除外
- 後続の保守改善Mission

## 対象外

- 初回Missionでは拡張機能の表示挙動を変えない
- 初回MissionではChrome Web Store公開workflowを追加しない
- 初回Missionでは外部ライブラリを追加しない

## 全体処理フロー

1. AI作業管理と再現可能なzip生成を整える。
2. 現在の拡張機能コードを確認する。
3. 必要な保守改善を小さなMissionに分ける。
4. 検証してからChrome Web Storeへ出す。

## 外部依存

- Chrome Extensions
- Chrome Web Store

## 制約

- 生成zipをコミットしない。
- 既存のプロダクトコード変更は、Missionごとに分ける。
- 追加権限は根拠がある場合だけ行う。

## 完了条件

- Grand Order / Ticketで作業を追跡できる
- zip生成がコマンドで再現できる
- 手作業生成zipを追跡しない
- 最低限の検証コマンドがある

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | 作業管理とpackage生成基盤を整える | 完了 | なし | プロダクト挙動は変えない |
| 2 | スクロール進捗ロジックをテスト可能に整理する | 完了 | Mission 1 | 表示仕様は変えない |
| 3 | Chrome Web Store向けzip構造に直す | 完了 | Mission 1 | manifestをzipルートへ置く |
| 4 | ページ全体コピー時に進捗表示を混ぜない | 完了 | Mission 2 | 表示文字は変えない |
| 5 | 拡張アイコンで表示ON/OFFを切り替える | 完了 | Mission 2 | 追加permissionなし |

Mission一覧は初期仮説として扱う。実装結果に応じて追加、分割、統合、並べ替えを行ってよい。ただし、完了済みMissionの意味を後から別の成果へ変更しないこと。

## 現在のMission

Mission 5は完了。次のMissionは未定。

## 未確定事項

- 次に行うプロダクトコード改善の範囲。

## 判断履歴

- 既存の `scroll_progress.zip` には `__MACOSX` が含まれていたため、手作業生成物として追跡から外す。
- まず依存追加なしのnpm scriptsで、syntax checkとzip生成だけを整える。
- Mission 2では、進捗計算を `core.js` に分け、Node標準テストで固定した。未使用の `activeTab` 権限は削除した。
- Mission 3では、Chrome Web Storeへuploadしやすいように `manifest.json` がzipルートへ入るpackage構造に直した。
- Mission 4では、進捗表示の `div` に選択除外と操作透過の指定を追加した。
- Mission 5では、永続保存なしのタブ単位ON/OFFにした。`storage`, `tabs`, `activeTab`, host permissionは追加しない。
