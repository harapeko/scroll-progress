import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../extension/indicator.js', import.meta.url), 'utf8')

function runIndicatorScript() {
  const attributes = new Map()
  const calls = { appended: 0, removed: 0 }
  // noinspection JSUnusedGlobalSymbols -- VM内で評価するindicator scriptから参照する。
  const element = {
    id: '',
    isConnected: false,
    textContent: '',
    style: {},
    /**
     * @param {string} name
     * @param {string} value
     */
    setAttribute(name, value) {
      attributes.set(name, value)
    },
    remove() {
      element.isConnected = false
      calls.removed += 1
    },
  }

  // noinspection JSUnusedGlobalSymbols -- VM内で評価するindicator scriptから参照する。
  const context = {
    ScrollProgressCore: {
      INDICATOR_ID: 'extension-scroll_progress',
      /** @param {number} progress */
      getIndicatorText(progress) {
        return `${progress} %`
      },
    },
    document: {
      body: {
        /** @param {object} appendedElement */
        appendChild(appendedElement) {
          assert.equal(appendedElement, element)
          element.isConnected = true
          calls.appended += 1
        },
      },
      /** @param {string} tagName */
      createElement(tagName) {
        assert.equal(tagName, 'div')
        return element
      },
    },
  }

  vm.createContext(context)
  vm.runInContext(source, context)

  const indicator = /** @type {ScrollProgressIndicatorApi} */ (
    Reflect.get(context, 'ScrollProgressIndicator')
  )

  return { attributes, calls, element, indicator }
}

test('indicatorは表示に必要な属性とstyleを設定する', () => {
  const { attributes, element, indicator } = runIndicatorScript()

  const createdElement = indicator.create()

  assert.equal(createdElement, element)
  assert.equal(element.id, 'extension-scroll_progress')
  assert.equal(element.textContent, '0 %')
  assert.equal(attributes.get('aria-hidden'), 'true')
  assert.deepEqual(element.style, {
    all: 'initial',
    background: '#eee',
    border: '1px solid #aaa',
    borderRadius: '0 3px 0 0',
    bottom: '0',
    boxSizing: 'border-box',
    color: '#111',
    direction: 'ltr',
    fontFamily: 'Arial, sans-serif',
    fontSize: '9px',
    fontWeight: '400',
    left: '0',
    lineHeight: '1.2',
    padding: '3px',
    pointerEvents: 'none',
    position: 'fixed',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    zIndex: '99999999',
  })
})

test('indicatorは同じelementを二重に追加しない', () => {
  const { calls, indicator } = runIndicatorScript()
  const element = indicator.create()

  indicator.show(element)
  indicator.show(element)

  assert.equal(calls.appended, 1)
})

test('indicatorは非表示後に同じelementを再表示できる', () => {
  const { calls, indicator } = runIndicatorScript()
  const element = indicator.create()

  indicator.show(element)
  indicator.hide(element)
  indicator.show(element)
  indicator.update(element, 42)

  assert.equal(calls.appended, 2)
  assert.equal(calls.removed, 1)
  assert.equal(element.textContent, '42 %')
})
