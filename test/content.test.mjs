import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/content.js', import.meta.url), 'utf8')

function runContentScript(options = {}) {
  const calls = {
    hidden: 0,
    shown: 0,
    throttleWaits: [],
    updated: [],
  }
  const listeners = {
    runtime: null,
    window: new Map(),
  }
  const indicatorElement = {}
  const progress = options.progress ?? 25
  const shouldAttach = options.shouldAttach ?? true

  const context = {
    ScrollProgressCore: {
      calculateDocumentProgress() {
        return progress
      },
      createToggleResponse(enabled) {
        return { enabled }
      },
      isToggleMessage(message) {
        return message?.type === 'toggle-scroll-progress'
      },
      normalizeEnabled(value) {
        return value !== false
      },
      shouldAttachIndicator() {
        return shouldAttach
      },
      throttle(callback, wait) {
        calls.throttleWaits.push(wait)
        return callback
      },
    },
    ScrollProgressIndicator: {
      create() {
        return indicatorElement
      },
      hide(element) {
        assert.equal(element, indicatorElement)
        calls.hidden += 1
      },
      show(element) {
        assert.equal(element, indicatorElement)
        calls.shown += 1
      },
      update(element, value) {
        assert.equal(element, indicatorElement)
        calls.updated.push(value)
      },
    },
    chrome: {
      runtime: {
        onMessage: {
          addListener(listener) {
            listeners.runtime = listener
          },
        },
      },
    },
    document: { body: {} },
    getComputedStyle() {
      return { overflowY: 'visible' }
    },
    window: {
      addEventListener(type, listener) {
        listeners.window.set(type, listener)
      },
    },
  }

  vm.createContext(context)
  vm.runInContext(source, context)

  return { calls, listeners }
}

test('content scriptは対応ページで表示とlistener登録を開始する', () => {
  const { calls, listeners } = runContentScript({ progress: 40 })

  assert.equal(typeof listeners.runtime, 'function')
  assert.equal(typeof listeners.window.get('load'), 'function')
  assert.equal(typeof listeners.window.get('scroll'), 'function')
  assert.deepEqual(calls.throttleWaits, [0, 100])
  assert.equal(calls.shown, 1)
  assert.deepEqual(calls.updated, [40])
})

test('content scriptはtoggle要求ごとに表示状態を反転する', () => {
  const { calls, listeners } = runContentScript()
  const responses = []

  listeners.runtime({ type: 'other' }, null, (response) => responses.push(response))
  listeners.runtime({ type: 'toggle-scroll-progress' }, null, (response) =>
    responses.push(response)
  )
  listeners.runtime({ type: 'toggle-scroll-progress' }, null, (response) =>
    responses.push(response)
  )

  assert.deepEqual(responses, [{ enabled: false }, { enabled: true }])
  assert.equal(calls.hidden, 1)
  assert.equal(calls.shown, 2)
  assert.deepEqual(calls.updated, [25, 25])
})

test('content scriptは対象外ページでlistenerを登録しない', () => {
  const { calls, listeners } = runContentScript({ shouldAttach: false })

  assert.equal(listeners.runtime, null)
  assert.equal(listeners.window.size, 0)
  assert.deepEqual(calls.throttleWaits, [])
  assert.equal(calls.shown, 0)
  assert.deepEqual(calls.updated, [])
})
