import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/background.js', import.meta.url), 'utf8')

function runBackgroundScript() {
  /**
   * @type {{
   *   badgeClears: number[],
   *   badgeUpdates: Array<[number, boolean]>,
   *   messages: Array<[number, { type: string }]>
   * }}
   */
  const calls = {
    badgeClears: [],
    badgeUpdates: [],
    messages: [],
  }
  /**
   * @type {{
   *   actionClick: ((tab: { id?: number }) => void) | null,
   *   tabUpdated: ((tabId: number, changeInfo: { status?: string }) => void) | null
   * }}
   */
  const listeners = {
    actionClick: null,
    tabUpdated: null,
  }
  /** @type {Array<(response?: unknown) => void>} */
  const pendingResponses = []
  /** @type {{ lastError?: { message?: string } }} */
  const runtime = { lastError: undefined }

  // noinspection JSUnusedGlobalSymbols -- VM内で評価するservice workerから参照する。
  const context = {
    ScrollProgressBadge: {
      /** @param {number} tabId */
      clear(tabId) {
        calls.badgeClears.push(tabId)
      },
      /**
       * @param {number} tabId
       * @param {boolean} enabled
       */
      update(tabId, enabled) {
        calls.badgeUpdates.push([tabId, enabled])
      },
    },
    ScrollProgressCore: {
      createToggleMessage() {
        return { type: 'toggle-scroll-progress' }
      },
      /** @param {unknown} response */
      readEnabledResponse(response) {
        if (
          typeof response !== 'object' ||
          response === null ||
          !('enabled' in response) ||
          typeof response.enabled === 'undefined'
        ) {
          return null
        }

        return response.enabled !== false
      },
    },
    chrome: {
      action: {
        onClicked: {
          /** @param {(tab: { id?: number }) => void} listener */
          addListener(listener) {
            listeners.actionClick = listener
          },
        },
      },
      runtime,
      tabs: {
        onUpdated: {
          /** @param {(tabId: number, changeInfo: { status?: string }) => void} listener */
          addListener(listener) {
            listeners.tabUpdated = listener
          },
        },
        /**
         * @param {number} tabId
         * @param {{ type: string }} message
         * @param {(response?: unknown) => void} callback
         */
        sendMessage(tabId, message, callback) {
          calls.messages.push([tabId, message])
          pendingResponses.push(callback)
        },
      },
    },
    importScripts() {},
  }

  vm.createContext(context)
  vm.runInContext(source, context)

  /**
   * @param {unknown} response
   * @param {{ message?: string }} [lastError]
   */
  function respond(response, lastError) {
    runtime.lastError = lastError
    const callback = pendingResponses.shift()
    assert.ok(callback)
    callback(response)
    runtime.lastError = undefined
  }

  return { calls, listeners, respond }
}

test('service workerはaction clickをcontent scriptへ送る', () => {
  const { calls, listeners, respond } = runBackgroundScript()
  const actionClick = listeners.actionClick
  assert.ok(actionClick)

  actionClick({ id: 12 })

  assert.deepEqual(calls.messages, [[12, { type: 'toggle-scroll-progress' }]])

  respond({ enabled: false })

  assert.deepEqual(calls.badgeUpdates, [[12, false]])
  assert.deepEqual(calls.badgeClears, [])
})

test('service workerは受信先がない場合に古いbadgeを消す', () => {
  const { calls, listeners, respond } = runBackgroundScript()
  const actionClick = listeners.actionClick
  assert.ok(actionClick)

  actionClick({ id: 21 })
  respond(undefined, { message: 'Receiving end does not exist.' })

  assert.deepEqual(calls.badgeUpdates, [])
  assert.deepEqual(calls.badgeClears, [21])
})

test('service workerはresponseが不正な場合に古いbadgeを消す', () => {
  const { calls, listeners, respond } = runBackgroundScript()
  const actionClick = listeners.actionClick
  assert.ok(actionClick)

  actionClick({ id: 22 })
  respond({})

  assert.deepEqual(calls.badgeUpdates, [])
  assert.deepEqual(calls.badgeClears, [22])
})

test('service workerはtab idがないclickを送信しない', () => {
  const { calls, listeners } = runBackgroundScript()
  const actionClick = listeners.actionClick
  assert.ok(actionClick)

  actionClick({})

  assert.deepEqual(calls.messages, [])
})

test('service workerはページ遷移開始時にbadgeを消す', () => {
  const { calls, listeners } = runBackgroundScript()
  const tabUpdated = listeners.tabUpdated
  assert.ok(tabUpdated)

  tabUpdated(30, { status: 'complete' })
  tabUpdated(30, { status: 'loading' })

  assert.deepEqual(calls.badgeClears, [30])
})
