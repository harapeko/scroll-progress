;(function (global) {
  'use strict'

  function update(tabId, enabled) {
    chrome.action.setBadgeBackgroundColor({ color: '#666666', tabId: tabId })
    chrome.action.setBadgeText({ text: enabled ? '' : 'OFF', tabId: tabId })
  }

  function clear(tabId) {
    chrome.action.setBadgeText({ text: '', tabId: tabId })
  }

  global.ScrollProgressBadge = {
    clear: clear,
    update: update,
  }
})(globalThis)
