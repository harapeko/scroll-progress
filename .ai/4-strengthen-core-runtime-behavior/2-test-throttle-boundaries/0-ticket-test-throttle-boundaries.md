# Ticket: Test Throttle Boundaries

## この文書の位置付け

> この文書は作成時点の作業指示であり、現在の仕様・実装のSOTではない。
> 実行前に現在のコード、テスト、設定を確認すること。

## 対象Grand Order

4: Strengthen Core Runtime Behavior

## 対象Mission

2: throttleの時間境界を固定する

## 目的

`throttle` の現在動作を偽時計で再現し、時間や実行環境に依存せず境界条件を確認できるようにする。

## 参照資料

- Grand Order: `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- 現在状態: `extension/core.js`, `test/core.test.mjs`
- 利用箇所: `extension/content.js`

## 前提

- 最初の呼び出しは即時実行する。
- 待機時間内の呼び出しは末尾の1回へ集約する。
- 期限を過ぎたtimerが残っている場合は解除して即時実行する。
- callbackは引数を受け取らず、戻り値を利用しない。

## 対象範囲

- `extension/core.js`
- `test/core.test.mjs`
- `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- このTicket

## 対象外

- throttleの公開interface変更
- cancel API追加
- callbackの引数や `this` の転送
- 実行方式変更

## 実行内容

- throttle内部の時刻とtimerを示す変数名を明確にする。
- timerの有無をnullとの比較で判定する。
- Date、setTimeout、clearTimeoutを制御するテストfixtureを追加する。
- leading、trailing、連続呼び出し、timer解除をテストする。

## 変更してよい範囲

- 対象範囲に記載したファイルのみ。

## 変更してはいけない範囲

- manifest
- package依存関係
- 生成zip

## 完了条件

- [x] 最初の呼び出しが即時実行される
- [x] 待機時間内の連続呼び出しが末尾1回に集約される
- [x] 待機時間経過後に再び即時実行できる
- [x] 期限超過したtimerが二重実行されない
- [x] 型検査とテストが通る

## 検証方法

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

---

## 実行後ログ

> ここから下は実行後に追記する。
> 実行前の作業指示を、実行後に別目的へ書き換えないこと。

## 実施内容

- throttle内部の状態を `trailingTimeout`, `lastInvocationTime`, `remainingWait` へ改名した。
- timerの有無を `null` との比較で判定するようにした。
- Dateとtimerを制御するfixtureを追加した。
- leading、trailing、連続呼び出し、期限超過timer解除をテストした。

## 変更ファイル

- `.ai/4-strengthen-core-runtime-behavior/0-grand-order/grand-order.md`
- `.ai/4-strengthen-core-runtime-behavior/2-test-throttle-boundaries/0-ticket-test-throttle-boundaries.md`
- `extension/core.js`
- `test/core.test.mjs`

## 検証結果

### 実行したコマンド

- `npm run typecheck`
- `npm run test`
- `GIT_CONFIG_GLOBAL=/dev/null git diff --check`

### 結果

- `npm run typecheck` は成功した。
- Node標準テストは27件成功した。
- 実時間の待機を使わず、時間境界を再現できた。

## 完了条件の確認

- [x] 最初の呼び出しが即時実行される
- [x] 待機時間内の連続呼び出しが末尾1回に集約される
- [x] 待機時間経過後に再び即時実行できる
- [x] 期限超過したtimerが二重実行されない
- [x] 型検査とテストが通る

## 未完了事項

- なし。
