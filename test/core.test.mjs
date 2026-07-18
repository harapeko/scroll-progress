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

function createThrottleFixture() {
  let now = 1000
  let nextTimerId = 1
  /** @type {Map<number, { callback: () => void, runAt: number }>} */
  const timers = new Map()

  const throttleContext = {
    Date: {
      now() {
        return now
      },
    },
    /**
     * @param {() => void} callback
     * @param {number} delay
     */
    setTimeout(callback, delay) {
      const timerId = nextTimerId
      nextTimerId += 1
      timers.set(timerId, { callback, runAt: now + delay })
      return timerId
    },
    /** @param {number} timerId */
    clearTimeout(timerId) {
      timers.delete(timerId)
    },
    /** @type {{ ScrollProgressCore?: ScrollProgressCoreApi }} */
    globalThis: {},
  }

  vm.createContext(throttleContext)
  vm.runInContext(source, throttleContext)

  const throttleCore = throttleContext.globalThis.ScrollProgressCore
  assert.ok(throttleCore)

  /**
   * 指定時刻まで、期限が来たtimerを順番に実行する。
   *
   * @param {number} elapsed
   */
  function advance(elapsed) {
    const targetTime = now + elapsed

    while (true) {
      const nextTimer = Array.from(timers.entries())
        .filter(([, timer]) => timer.runAt <= targetTime)
        .sort((left, right) => left[1].runAt - right[1].runAt)[0]

      if (!nextTimer) {
        break
      }

      const [timerId, timer] = nextTimer
      now = timer.runAt
      timers.delete(timerId)
      timer.callback()
    }

    now = targetTime
  }

  /** @param {number} elapsed */
  function elapseWithoutTimers(elapsed) {
    now += elapsed
  }

  return {
    advance,
    elapseWithoutTimers,
    now: () => now,
    pendingTimers: () => timers.size,
    core: throttleCore,
  }
}

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

test('throttleは先頭を即時実行し連続呼び出しを末尾1回にまとめる', () => {
  const fixture = createThrottleFixture()
  /** @type {number[]} */
  const invokedAt = []
  const throttled = fixture.core.throttle(() => invokedAt.push(fixture.now()), 100)

  throttled()
  fixture.advance(20)
  throttled()
  fixture.advance(30)
  throttled()

  assert.deepEqual(invokedAt, [1000])
  assert.equal(fixture.pendingTimers(), 1)

  fixture.advance(50)

  assert.deepEqual(invokedAt, [1000, 1100])
  assert.equal(fixture.pendingTimers(), 0)

  fixture.advance(100)
  throttled()

  assert.deepEqual(invokedAt, [1000, 1100, 1200])
})

test('throttleは期限を過ぎたtimerを解除して二重実行しない', () => {
  const fixture = createThrottleFixture()
  /** @type {number[]} */
  const invokedAt = []
  const throttled = fixture.core.throttle(() => invokedAt.push(fixture.now()), 100)

  throttled()
  fixture.advance(20)
  throttled()
  fixture.elapseWithoutTimers(100)
  throttled()

  assert.deepEqual(invokedAt, [1000, 1120])
  assert.equal(fixture.pendingTimers(), 0)

  fixture.advance(100)

  assert.deepEqual(invokedAt, [1000, 1120])
})
