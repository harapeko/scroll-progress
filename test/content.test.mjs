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

/** @typedef {(...args: never[]) => void} StoredEventListener */

/**
 * @param {{ progress?: number | null }} [options]
 */
function runContentScript(options = {}) {
  /**
   * @type {{
   *   hidden: number,
   *   elementSources: object[],
   *   observedElements: object[],
   *   shown: number,
   *   throttleWaits: number[],
   *   unobservedElements: object[],
   *   updated: number[]
   * }}
   */
  const calls = {
    elementSources: [],
    hidden: 0,
    observedElements: [],
    shown: 0,
    throttleWaits: [],
    unobservedElements: [],
    updated: [],
  }
  /** @type {(() => void) | null} */
  let resizeObserverCallback = null
  /**
   * @type {{
   *   document: Map<string, StoredEventListener>,
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
  const progress = options.progress === undefined ? 25 : options.progress
  class ElementStub {
    /**
     * @param {number | null} elementProgress
     * @param {boolean} verticallyScrollable
     */
    constructor(elementProgress, verticallyScrollable) {
      this.clientHeight = 100
      this.isConnected = true
      this.progress = elementProgress
      this.scrollHeight = verticallyScrollable ? 200 : 100
    }
  }
  const documentObject = {
    body: {},
    /** @type {object | null} */
    fullscreenElement: null,
    /**
     * @param {string} type
     * @param {StoredEventListener} listener
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
      /** @param {{ progress?: number | null }} element */
      calculateElementProgress(element) {
        calls.elementSources.push(element)
        return element.progress ?? null
      },
      /** @param {boolean} enabled */
      createToggleResponse(enabled) {
        return { enabled }
      },
      /** @param {{ type?: string } | null | undefined} message */
      isToggleMessage(message) {
        return message?.type === 'toggle-scroll-progress'
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
    ResizeObserver: class {
      /** @param {() => void} callback */
      constructor(callback) {
        resizeObserverCallback = callback
      }

      /** @param {object} element */
      observe(element) {
        calls.observedElements.push(element)
      }

      /** @param {object} element */
      unobserve(element) {
        calls.unobservedElements.push(element)
      }
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
    Element: ElementStub,
    document: documentObject,
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
    notifyElementResize() {
      assert.ok(resizeObserverCallback)
      resizeObserverCallback()
    },
    /** @param {boolean} fullscreen */
    setFullscreen(fullscreen) {
      documentObject.fullscreenElement = fullscreen ? {} : null
    },
    /** @param {number} elementProgress */
    createScrollElement(elementProgress) {
      return new ElementStub(elementProgress, true)
    },
    createHorizontalScrollElement() {
      return new ElementStub(null, false)
    },
  }
}

test('content scriptは対応ページで表示とlistener登録を開始する', () => {
  const { calls, listeners } = runContentScript({ progress: 40 })

  assert.equal(typeof listeners.runtime, 'function')
  assert.equal(typeof listeners.document.get('fullscreenchange'), 'function')
  assert.equal(typeof listeners.window.get('load'), 'function')
  assert.equal(typeof listeners.window.get('resize'), 'function')
  assert.equal(typeof listeners.document.get('scroll'), 'function')
  assert.deepEqual(calls.throttleWaits, [100])
  assert.equal(calls.shown, 1)
  assert.deepEqual(calls.updated, [40])
})

test('content scriptは最後にscrollされたelementの進捗を表示する', () => {
  const { calls, createScrollElement, listeners } = runContentScript({ progress: null })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  assert.ok(scroll)
  const leftPane = createScrollElement(20)
  const rightPane = createScrollElement(75)

  scroll({ target: leftPane })
  scroll({ target: rightPane })

  assert.deepEqual(calls.elementSources, [leftPane, rightPane])
  assert.deepEqual(calls.observedElements, [leftPane, rightPane])
  assert.deepEqual(calls.unobservedElements, [leftPane])
  assert.deepEqual(calls.updated, [20, 75])
  assert.equal(calls.shown, 2)
})

test('content scriptはDocumentのscrollへ戻る', () => {
  const { calls, createScrollElement, listeners } = runContentScript({ progress: 45 })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  assert.ok(scroll)

  const pane = createScrollElement(80)
  scroll({ target: pane })
  scroll({ target: {} })

  assert.deepEqual(calls.updated, [45, 80, 45])
  assert.deepEqual(calls.observedElements, [pane])
  assert.deepEqual(calls.unobservedElements, [pane])
})

test('content scriptは横方向だけのscrollでactive elementを変えない', () => {
  const { calls, createHorizontalScrollElement, createScrollElement, listeners } =
    runContentScript({ progress: 40 })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  const resize = listeners.window.get('resize')
  assert.ok(scroll)
  assert.ok(resize)
  const verticalPane = createScrollElement(70)

  scroll({ target: verticalPane })
  scroll({ target: createHorizontalScrollElement() })
  resize()

  assert.deepEqual(calls.elementSources, [verticalPane, verticalPane])
  assert.deepEqual(calls.updated, [40, 70, 70])
})

test('content scriptはresize後にactive elementを再計算する', () => {
  const { calls, createScrollElement, listeners } = runContentScript({ progress: 10 })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  const resize = listeners.window.get('resize')
  assert.ok(scroll)
  assert.ok(resize)
  const pane = createScrollElement(20)

  scroll({ target: pane })
  pane.progress = 65
  resize()

  assert.deepEqual(calls.updated, [10, 20, 65])
})

test('content scriptはactive elementのresize後に進捗を再計算する', () => {
  const { calls, createScrollElement, listeners, notifyElementResize } = runContentScript({
    progress: 10,
  })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  assert.ok(scroll)
  const pane = createScrollElement(20)

  scroll({ target: pane })
  pane.progress = 65
  notifyElementResize()

  assert.deepEqual(calls.updated, [10, 20, 65])
})

test('content scriptは切断されたelementからDocumentへ戻る', () => {
  const { calls, createScrollElement, listeners, notifyElementResize } = runContentScript({
    progress: 35,
  })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  assert.ok(scroll)
  const pane = createScrollElement(80)

  scroll({ target: pane })
  pane.isConnected = false
  notifyElementResize()

  assert.deepEqual(calls.updated, [35, 80, 35])
  assert.deepEqual(calls.unobservedElements, [pane])
})

test('content scriptはactive elementがscroll不可になると隠れる', () => {
  const { calls, createScrollElement, listeners, notifyElementResize } = runContentScript({
    progress: 40,
  })
  const scroll = /** @type {((event: { target: unknown }) => void) | undefined} */ (
    listeners.document.get('scroll')
  )
  assert.ok(scroll)
  const pane = createScrollElement(70)

  scroll({ target: pane })
  pane.progress = null
  pane.scrollHeight = pane.clientHeight
  notifyElementResize()

  assert.deepEqual(calls.updated, [40, 70])
  assert.equal(calls.hidden, 1)
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

test('content scriptはdocumentがscroll不可でもelement scrollを待つ', () => {
  const { calls, listeners } = runContentScript({ progress: null })

  assert.equal(typeof listeners.runtime, 'function')
  assert.equal(typeof listeners.document.get('scroll'), 'function')
  assert.equal(typeof listeners.window.get('load'), 'function')
  assert.equal(typeof listeners.window.get('resize'), 'function')
  assert.deepEqual(calls.throttleWaits, [100])
  assert.equal(calls.hidden, 1)
  assert.equal(calls.shown, 0)
  assert.deepEqual(calls.updated, [])
})
