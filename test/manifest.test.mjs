import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const manifest = JSON.parse(
  fs.readFileSync(new URL('../extension/manifest.json', import.meta.url), 'utf8'),
)

test('content scriptはHTTPとHTTPSだけを対象にする', () => {
  assert.deepEqual(manifest.content_scripts[0].matches, ['*://*/*'])
})
