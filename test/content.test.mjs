import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/content.js', import.meta.url), 'utf8')

/**
 * @typedef {(
 *   message: unknown,
 *   sender: unknown,
 *   sendResponse: (response: { enabled: boolean }) => void
 * ) => void} RuntimeMessageListener
 */

/**
 * @param {{ progress?: number, shouldAttach?: boolean }} [options]
 */
function runContentScript(options = {}) {
  /**
   * @type {{
   *   hidden: number,
   *   shown: number,
   *   throttleWaits: number[],
   *   updated: number[]
   * }}
   */
  const calls = {
    hidden: 0,
    shown: 0,
    throttleWaits: [],
    updated: [],
  }
  /**
   * @type {{
   *   document: Map<string, () => void>,
   *   runtime: RuntimeMessageListener | null,
   *   window: Map<string, () => void>
   * }}
   */
  const listeners = {
    document: new Map(),
    runtime: null,
    window: new Map(),
  }
  const indicatorElement = {}
  const progress = options.progress ?? 25
  const shouldAttach = options.shouldAttach ?? true
  const documentObject = {
    body: {},
    /** @type {object | null} */
    fullscreenElement: null,
    /**
     * @param {string} type
     * @param {() => void} listener
     */
    addEventListener(type, listener) {
      listeners.document.set(type, listener)
    },
  }

  // noinspection JSUnusedGlobalSymbols -- VM内で評価するcontent scriptから参照する。
  const context = {
    ScrollProgressCore: {
      calculateDocumentProgress() {
        return progress
      },
      /** @param {boolean} enabled */
      createToggleResponse(enabled) {
        return { enabled }
      },
      /** @param {{ type?: string } | null | undefined} message */
      isToggleMessage(message) {
        return message?.type === 'toggle-scroll-progress'
      },
      shouldAttachIndicator() {
        return shouldAttach
      },
      /**
       * @param {() => void} callback
       * @param {number} wait
       */
      throttle(callback, wait) {
        calls.throttleWaits.push(wait)
        return callback
      },
    },
    ScrollProgressIndicator: {
      create() {
        return indicatorElement
      },
      /** @param {object} element */
      hide(element) {
        assert.equal(element, indicatorElement)
        calls.hidden += 1
      },
      /** @param {object} element */
      show(element) {
        assert.equal(element, indicatorElement)
        calls.shown += 1
      },
      /**
       * @param {object} element
       * @param {number} value
       */
      update(element, value) {
        assert.equal(element, indicatorElement)
        calls.updated.push(value)
      },
    },
    chrome: {
      runtime: {
        onMessage: {
          /** @param {RuntimeMessageListener} listener */
          addListener(listener) {
            listeners.runtime = listener
          },
        },
      },
    },
    document: documentObject,
    getComputedStyle() {
      return { overflowY: 'visible' }
    },
    window: {
      /**
       * @param {string} type
       * @param {() => void} listener
       */
      addEventListener(type, listener) {
        listeners.window.set(type, listener)
      },
    },
  }

  vm.createContext(context)
  vm.runInContext(source, context)

  return {
    calls,
    listeners,
    /** @param {boolean} fullscreen */
    setFullscreen(fullscreen) {
      documentObject.fullscreenElement = fullscreen ? {} : null
    },
  }
}

test('content scriptは対応ページで表示とlistener登録を開始する', () => {
  const { calls, listeners } = runContentScript({ progress: 40 })

  assert.equal(typeof listeners.runtime, 'function')
  assert.equal(typeof listeners.document.get('fullscreenchange'), 'function')
  assert.equal(typeof listeners.window.get('load'), 'function')
  assert.equal(typeof listeners.window.get('scroll'), 'function')
  assert.deepEqual(calls.throttleWaits, [100])
  assert.equal(calls.shown, 1)
  assert.deepEqual(calls.updated, [40])
})

test('content scriptはFullscreen中に隠れて解除後に復帰する', () => {
  const { calls, listeners, setFullscreen } = runContentScript({ progress: 60 })
  const fullscreenChange = listeners.document.get('fullscreenchange')
  assert.ok(fullscreenChange)

  setFullscreen(true)
  fullscreenChange()

  assert.equal(calls.hidden, 1)
  assert.equal(calls.shown, 1)
  assert.deepEqual(calls.updated, [60])

  setFullscreen(false)
  fullscreenChange()

  assert.equal(calls.shown, 2)
  assert.deepEqual(calls.updated, [60, 60])
})

test('content scriptはtoggle要求ごとに表示状態を反転する', () => {
  const { calls, listeners } = runContentScript()
  /** @type {Array<{ enabled: boolean }>} */
  const responses = []
  const runtimeListener = listeners.runtime
  assert.ok(runtimeListener)

  runtimeListener({ type: 'other' }, null, (response) => responses.push(response))
  runtimeListener({ type: 'toggle-scroll-progress' }, null, (response) =>
    responses.push(response)
  )
  runtimeListener({ type: 'toggle-scroll-progress' }, null, (response) =>
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
  assert.equal(listeners.document.size, 0)
  assert.equal(listeners.window.size, 0)
  assert.deepEqual(calls.throttleWaits, [])
  assert.equal(calls.shown, 0)
  assert.deepEqual(calls.updated, [])
})
