import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../scroll_progress/core.js', import.meta.url), 'utf8')
const context = { globalThis: {} }

vm.createContext(context)
vm.runInContext(source, context)

const core = context.globalThis.ScrollProgressCore

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

test('shouldAttachIndicatorはbody overflow autoを既存どおり除外する', () => {
  assert.equal(core.shouldAttachIndicator({ overflowY: 'auto' }), false)
  assert.equal(core.shouldAttachIndicator({ overflowY: 'visible' }), true)
})
