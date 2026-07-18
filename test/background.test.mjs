import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/background.js', import.meta.url), 'utf8')

function runBackgroundScript() {
  const calls = {
    badgeClears: [],
    badgeUpdates: [],
    messages: [],
  }
  const listeners = {
    actionClick: null,
    tabUpdated: null,
  }
  const pendingResponses = []
  const runtime = { lastError: undefined }

  const context = {
    ScrollProgressBadge: {
      clear(tabId) {
        calls.badgeClears.push(tabId)
      },
      update(tabId, enabled) {
        calls.badgeUpdates.push([tabId, enabled])
      },
    },
    ScrollProgressCore: {
      createToggleMessage() {
        return { type: 'toggle-scroll-progress' }
      },
      readEnabledResponse(response) {
        if (!response || typeof response.enabled === 'undefined') {
          return null
        }

        return response.enabled !== false
      },
    },
    chrome: {
      action: {
        onClicked: {
          addListener(listener) {
            listeners.actionClick = listener
          },
        },
      },
      runtime,
      tabs: {
        onUpdated: {
          addListener(listener) {
            listeners.tabUpdated = listener
          },
        },
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

  function respond(response, lastError) {
    runtime.lastError = lastError
    pendingResponses.shift()(response)
    runtime.lastError = undefined
  }

  return { calls, listeners, respond }
}

test('service workerはaction clickをcontent scriptへ送る', () => {
  const { calls, listeners, respond } = runBackgroundScript()

  listeners.actionClick({ id: 12 })

  assert.deepEqual(calls.messages, [[12, { type: 'toggle-scroll-progress' }]])

  respond({ enabled: false })

  assert.deepEqual(calls.badgeUpdates, [[12, false]])
  assert.deepEqual(calls.badgeClears, [])
})

test('service workerは受信先がない場合に古いbadgeを消す', () => {
  const { calls, listeners, respond } = runBackgroundScript()

  listeners.actionClick({ id: 21 })
  respond(undefined, { message: 'Receiving end does not exist.' })

  assert.deepEqual(calls.badgeUpdates, [])
  assert.deepEqual(calls.badgeClears, [21])
})

test('service workerはresponseが不正な場合に古いbadgeを消す', () => {
  const { calls, listeners, respond } = runBackgroundScript()

  listeners.actionClick({ id: 22 })
  respond({})

  assert.deepEqual(calls.badgeUpdates, [])
  assert.deepEqual(calls.badgeClears, [22])
})

test('service workerはtab idがないclickを送信しない', () => {
  const { calls, listeners } = runBackgroundScript()

  listeners.actionClick({})

  assert.deepEqual(calls.messages, [])
})

test('service workerはページ遷移開始時にbadgeを消す', () => {
  const { calls, listeners } = runBackgroundScript()

  listeners.tabUpdated(30, { status: 'complete' })
  listeners.tabUpdated(30, { status: 'loading' })

  assert.deepEqual(calls.badgeClears, [30])
})
