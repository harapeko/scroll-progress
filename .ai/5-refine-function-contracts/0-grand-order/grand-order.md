# Grand Order: Refine Function Contracts

## この文書の位置付け

> この文書は作業管理資料であり、現在の仕様・実装のSOTではない。
> 現在状態は、ソースコード、テスト、設定、実際の入出力を確認すること。

## チケット番号

5

## 目的

extension内の各関数を、責務、入力、戻り値、所有moduleが読み取りやすい状態にする。

## 背景

- Grand Order 4で進捗計算とthrottleの境界を固定した。
- `core.js` にはscript間契約に加え、indicatorだけが使うDOM処理と未使用の公開定数が残っている。
- toggle responseは自前でbooleanを返す一方、読み取り側はboolean以外もtrueとして受理する。
- `indicator.js` はDOM操作を持つが直接テストされていない。
- adapter scriptには型が広すぎる引数や、実質的な効果がないthrottle呼び出しがある。

## 要求のSOT

- 業務要件: 各関数を専門的な観点でリファクタリングする。
- API仕様: Chrome Extensions Manifest V3、DOM、CSSOM View。
- 現在状態: `extension/*.js`, `test/*.mjs`, `types/globals.d.ts`。
- 制約: buildなし、外部依存なし、`globalThis` 経由の連携を維持する。

## 現在コードの観察

- `core.js`
  - `TOGGLE_MESSAGE_TYPE` と `normalizeEnabled` は他scriptから参照されていない。
  - `keepIndicatorOutOfPageSelection` はindicator生成時に1回だけ使うDOM処理である。
  - messageとresponseのobject判定は安全だが、response値の契約がbooleanより広い。
- `indicator.js`
  - 生成、表示、非表示、更新を所有する。
  - `getElementById` による表示判定は、別elementのID衝突でも表示を止める。
  - 古いDOM削除形式を使っている。
- `content.js`
  - `applyEnabled` はunknownを受け取るが、呼び出し側はbooleanだけを渡す。
  - `load` は1回だけ発火するため、wait 0のthrottleは効果がない。
- `background.js`
  - `runtime.lastError` より先にresponseを読む。
  - Chrome callback引数のJSDocが構造型に限定されている。
- `badge.js`
  - Promise処理helperの名前が一般的で、対象処理が名前から分からない。

## 対象範囲

- `extension/` 配下のJavaScript
- `test/` 配下のNode標準テスト
- `types/globals.d.ts`
- 必要な管理資料

## 対象外

- ES Modules化
- TypeScript化
- クラス化
- 外部依存追加
- permission変更
- UI仕様変更
- 永続設定追加

## 全体処理フロー

1. coreの公開契約とmessage/response判定を絞る。
2. indicator固有のDOM処理をindicatorへ集める。
3. content、background、badgeのadapter処理を簡潔にする。
4. 構文、型、テスト、zip生成を検証する。

## 外部依存

- Chrome Extensions API
- DOM API
- CSSOM View

新しい依存関係は追加しない。

## 制約

- `globalThis.ScrollProgressCore` などの公開方法を維持する。
- productionで参照中の公開APIは維持する。
- 不正なmessage/response以外の機能動作を変えない。
- 関数を減らすこと自体を目的にしない。
- 生成zipはコミットしない。

## 完了条件

- 公開APIがproductionの利用箇所と一致する。
- toggle responseはbooleanだけを有効値として受理する。
- indicator固有のDOM処理がindicator module内にある。
- adapter関数の引数型と責務が呼び出し側に合っている。
- `npm run typecheck` と `npm run verify` が成功する。
- 生成zipがコミットされない。

## Mission一覧

| No. | Mission | 状態 | 依存 | 備考 |
|---:|---|---|---|---|
| 1 | coreの公開契約と判定を絞る | 完了 | なし | message/responseを含む |
| 2 | indicatorへDOM責務を集める | 完了 | Mission 1 | 直接テストを追加 |
| 3 | adapter関数を整理する | 完了 | Mission 1, 2 | content/background/badge |
| 4 | throttleの実行状態を集約する | 完了 | Mission 1 | 先頭・末尾の実行契約を維持 |
| 5 | badge反映の失敗分岐を集約する | 完了 | Mission 3 | 送信失敗をresponseより優先 |
| 6 | action tab IDのbindingを簡潔にする | 完了 | Mission 3 | callbackまで数値IDを固定 |
| 7 | 非推奨CSS aliasとVM警告を整理する | 完了 | Mission 2, 4 | 標準 `userSelect` を使用 |

## 現在のMission

Mission 7は完了。Grand Order 5の完了条件を満たした。

## 未確定事項

- なし。

## 判断履歴

- productionから参照されていない公開定数と関数は、global APIから外す。
- toggle responseは自分でbooleanを生成しているため、読み取り側でもbooleanだけを受理する。
- function宣言は名前付きstack traceと既存形式を保てるため、一括してarrow functionへ変えない。
- 1回しか発火しないeventへwait 0のthrottleは使わない。
- Mission 1では、toggle responseをboolean契約へ絞り、production未使用の公開項目を外した。
- Mission 2では、indicator固有のDOM設定を生成処理へ戻し、indicator APIを直接テストした。
- Mission 3では、adapter関数の名前、引数型、error処理順を実際の呼び出しへ合わせた。
- throttleの利用箇所は引数と `this` を使わないため、callback引数の転送は公開契約へ追加しない。
- Mission 4では、throttleの実行状態を集約し、時刻0でも最初の呼び出しを即時実行することをテストした。
- 送信失敗と不正responseはどちらもbadgeを消すため、状態の読み取り結果を `null` に揃えて扱う。
- Mission 5では、送信失敗を正常形式のresponseより優先することをテストで固定した。
- action handlerはtab IDだけを使うため、引数の分割代入で数値判定後のbindingを保持する。
- Mission 6では、tab IDの移し替えを削除し、既存の送信処理と失敗処理を維持した。
- `webkitUserSelect` は標準 `userSelect` の非推奨aliasであり、両方を設定する必要はない。
- Mission 7では、非推奨aliasを削除し、VM stubだけに動的参照のinspection指定を付けた。
