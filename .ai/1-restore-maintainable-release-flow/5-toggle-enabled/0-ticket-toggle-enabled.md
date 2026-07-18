# Ticket: Toggle Enabled

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

1: Restore Maintainable Release Flow

## 対象Mission

5: 拡張アイコンで表示ON/OFFを切り替える

## 目的

ユーザーが必要なときだけ、現在のタブのスクロール進捗表示をON/OFFできるようにする。

## 参照資料

- 要求のSOT: ユーザー指示「on/off機能を実装したい。特別な権限を追加せずにトグルできるのが期待」「永久に保存できなくてもいい」
- 現在状態: `scroll_progress/manifest.json`, `scroll_progress/core.js`, `scroll_progress/scroll_progress.js`
- 外部根拠: Chrome公式ドキュメントでは、`chrome.action` はmanifestの `"action"` キーで利用する。`tabs.sendMessage()` はextensionからcontent scriptへ一度だけmessageを送るAPIとして説明されている。

## 前提

- 永続的なON/OFF設定は作らない。
- 拡張アイコンのクリックで現在のタブだけON/OFFを切り替える。
- `storage`, `tabs`, `activeTab`, host permissionは追加しない。
- ページを再読み込みした場合は既定どおり表示する。

## 対象範囲

- `scroll_progress/manifest.json`
- `scroll_progress/background.js`
- `scroll_progress/core.js`
- `scroll_progress/scroll_progress.js`
- `scripts/build-zip.sh`
- `test/core.test.mjs`
- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- このTicket

## 対象外

- options page
- popup UI
- ページ別のON/OFF
- host permission追加
- 追加ライブラリ

## 実行内容

- manifestに `action` と `background.service_worker` を追加する。
- background service workerで、拡張アイコンクリック時に現在のタブのcontent scriptへtoggle messageを送る。
- OFF時は現在のタブのbadgeに `OFF` を出す。
- content scriptはmessageを受けたら、そのタブ内の表示状態を反転する。
- タブ更新時は永続しない状態に合わせてbadgeを消す。
- zip生成対象に `background.js` を含める。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- 画像アセット
- 生成zip
- package依存関係
- `storage`, `tabs`, `activeTab`, host permission

## 完了条件

- [x] 拡張アイコンでON/OFF設定を切り替えられる
- [x] OFF時は進捗表示を消せる
- [x] 永続保存しない
- [x] `storage`, `tabs`, `activeTab`, host permissionを追加しない
- [x] 追加した設定判定をテストする

## 検証方法

- `npm run verify`
- `unzip -l scroll_progress.zip`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- manifestに `action` と `background.service_worker` を追加した。
- background service workerから現在のタブのcontent scriptへtoggle messageを送るようにした。
- content scriptで、そのタブ内の表示状態だけを反転するようにした。
- OFF時は現在のタブのbadgeへ `OFF` を表示するようにした。
- タブ更新時にbadgeを消すようにした。
- zip生成対象に `background.js` を追加した。

## 変更ファイル

- `.ai/1-restore-maintainable-release-flow/0-grand-order/grand-order.md`
- `.ai/1-restore-maintainable-release-flow/5-toggle-enabled/0-ticket-toggle-enabled.md`
- `scripts/build-zip.sh`
- `scroll_progress/background.js`
- `scroll_progress/core.js`
- `scroll_progress/manifest.json`
- `scroll_progress/scroll_progress.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run verify`
- `node -e "const m=require('./scroll_progress/manifest.json'); if (m.permissions) throw new Error('permissions must not be present'); console.log('no permissions')"`
- `unzip -l scroll_progress.zip`
- `npm run clean`
- `test ! -f scroll_progress.zip`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run verify` は成功した。
- Node標準テストは7件成功した。
- manifestに `permissions` キーがないことを確認した。
- `unzip -l` で `background.js` がzipに含まれていることを確認した。
- 生成zipは削除済み。
- 空白確認に成功した。

## 完了条件の確認

- [x] 拡張アイコンでON/OFF設定を切り替えられる
- [x] OFF時は進捗表示を消せる
- [x] 永続保存しない
- [x] `storage`, `tabs`, `activeTab`, host permissionを追加しない
- [x] 追加した設定判定をテストする

## 未完了事項

- なし
