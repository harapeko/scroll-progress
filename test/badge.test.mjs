import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/badge.js', import.meta.url), 'utf8')

/**
 * @param {{ reject?: boolean }} [options]
 */
function runBadgeScript(options = {}) {
  /** @type {Array<{ color: string, tabId: number }>} */
  const backgroundColors = []
  /** @type {Array<{ text: string, tabId: number }>} */
  const texts = []

  function result() {
    return options.reject ? Promise.reject(new Error('tab was closed')) : Promise.resolve()
  }

  // noinspection JSUnusedGlobalSymbols -- VM内で評価するbadge scriptから参照する。
  const context = {
    ScrollProgressCore: {
      /** @param {boolean} enabled */
      getBadgeText(enabled) {
        return enabled ? 'ON' : 'OFF'
      },
    },
    chrome: {
      action: {
        /** @param {{ color: string, tabId: number }} details */
        setBadgeBackgroundColor(details) {
          backgroundColors.push({ color: details.color, tabId: details.tabId })
          return result()
        },
        /** @param {{ text: string, tabId: number }} details */
        setBadgeText(details) {
          texts.push({ text: details.text, tabId: details.tabId })
          return result()
        },
      },
    },
  }

  vm.createContext(context)
  vm.runInContext(source, context)

  const badge = /** @type {ScrollProgressBadgeApi} */ (
    Reflect.get(context, 'ScrollProgressBadge')
  )

  return { backgroundColors, badge, texts }
}

test('badgeはtabごとの色と状態を更新する', () => {
  const { backgroundColors, badge, texts } = runBadgeScript()

  badge.update(12, false)

  assert.deepEqual(backgroundColors, [{ color: '#666666', tabId: 12 }])
  assert.deepEqual(texts, [{ text: 'OFF', tabId: 12 }])
})

test('badgeはtabごとの表示を消す', () => {
  const { badge, texts } = runBadgeScript()

  badge.clear(21)

  assert.deepEqual(texts, [{ text: '', tabId: 21 }])
})

test('badge更新先のtabがなくてもrejectを残さない', async () => {
  const { badge } = runBadgeScript({ reject: true })

  badge.update(30, true)
  badge.clear(30)

  await new Promise((resolve) => setImmediate(resolve))
})
