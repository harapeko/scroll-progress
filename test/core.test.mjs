import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/core.js', import.meta.url), 'utf8')
/** @type {{ globalThis: { ScrollProgressCore?: ScrollProgressCoreApi } }} */
const context = { globalThis: {} }

vm.createContext(context)
vm.runInContext(source, context)

const core = context.globalThis.ScrollProgressCore
assert.ok(core)

test('calculateProgressはスクロール率を整数にする', () => {
  assert.equal(core.calculateProgress(50, 200, 100), 50)
})

test('calculateProgressは範囲外の値を0から100へ丸める', () => {
  assert.equal(core.calculateProgress(-10, 200, 100), 0)
  assert.equal(core.calculateProgress(150, 200, 100), 100)
})

test('calculateProgressはスクロールできないページでnullを返す', () => {
  assert.equal(core.calculateProgress(0, 100, 100), null)
  assert.equal(core.calculateProgress(0, 80, 100), null)
})

test('calculateDocumentProgressはdocument/windowからスクロール率を計算する', () => {
  const documentObject = {
    scrollingElement: { scrollHeight: 400, scrollTop: 75 },
    documentElement: { scrollHeight: 100, scrollTop: 0 },
  }
  const windowObject = { innerHeight: 100 }

  assert.equal(core.calculateDocumentProgress(documentObject, windowObject), 25)
})

test('calculateDocumentProgressはscrollingElementがない場合にdocumentElementを使う', () => {
  const documentObject = {
    scrollingElement: null,
    documentElement: { scrollHeight: 300, scrollTop: 60 },
  }
  const windowObject = { innerHeight: 100 }

  assert.equal(core.calculateDocumentProgress(documentObject, windowObject), 30)
})

test('shouldAttachIndicatorはbody overflow autoを既存どおり除外する', () => {
  assert.equal(core.shouldAttachIndicator({ overflowY: 'auto' }), false)
  assert.equal(core.shouldAttachIndicator({ overflowY: 'visible' }), true)
})

test('normalizeEnabledはfalseだけを無効扱いにする', () => {
  assert.equal(core.normalizeEnabled(false), false)
  assert.equal(core.normalizeEnabled(true), true)
  assert.equal(core.normalizeEnabled(undefined), true)
  assert.equal(core.normalizeEnabled('off'), true)
})

test('TOGGLE_MESSAGE_TYPEはcontent scriptとbackgroundで共有する', () => {
  assert.equal(core.TOGGLE_MESSAGE_TYPE, 'toggle-scroll-progress')
})

test('toggle messageの作成と判定を共有する', () => {
  const message = core.createToggleMessage()

  assert.equal(message.type, 'toggle-scroll-progress')
  assert.equal(core.isToggleMessage(message), true)
  assert.equal(core.isToggleMessage({ type: 'other' }), false)
  assert.equal(core.isToggleMessage(null), false)
})

test('toggle responseはenabledを正規化して返す', () => {
  assert.equal(core.createToggleResponse(false).enabled, false)
  assert.equal(core.createToggleResponse(undefined).enabled, true)
})

test('readEnabledResponseはresponseから有効状態を読む', () => {
  assert.equal(core.readEnabledResponse({ enabled: false }), false)
  assert.equal(core.readEnabledResponse({ enabled: true }), true)
  assert.equal(core.readEnabledResponse({ enabled: 'unexpected' }), true)
  assert.equal(core.readEnabledResponse({}), null)
  assert.equal(core.readEnabledResponse(null), null)
})

test('getBadgeTextはOFF時だけ表示文字を返す', () => {
  assert.equal(core.getBadgeText(false), 'OFF')
  assert.equal(core.getBadgeText(true), '')
  assert.equal(core.getBadgeText(undefined), '')
})

test('getIndicatorTextは進捗値に単位を付ける', () => {
  assert.equal(core.getIndicatorText(0), '0 %')
  assert.equal(core.getIndicatorText(37), '37 %')
  assert.equal(core.getIndicatorText(100), '100 %')
})

test('keepIndicatorOutOfPageSelectionは拡張表示を本文コピーから外しやすくする', () => {
  const attributes = new Map()
  /** @type {IndicatorSelectionElement} */
  // noinspection JSUnusedGlobalSymbols -- 評価対象へ渡す要素のfixture。
  const element = {
    setAttribute(name, value) {
      attributes.set(name, value)
    },
    style: {},
  }

  core.keepIndicatorOutOfPageSelection(element)

  assert.equal(attributes.get('aria-hidden'), 'true')
  assert.equal(element.style.pointerEvents, 'none')
  assert.equal(element.style.userSelect, 'none')
  assert.equal(element.style.webkitUserSelect, 'none')
})
