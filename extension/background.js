importScripts('core.js', 'badge.js')

;(function () {
  'use strict'

  var core = globalThis.ScrollProgressCore
  var badge = globalThis.ScrollProgressBadge

  chrome.action.onClicked.addListener(function (tab) {
    if (typeof tab.id !== 'number') {
      return
    }

    chrome.tabs.sendMessage(tab.id, { type: core.TOGGLE_MESSAGE_TYPE }, function (response) {
      if (chrome.runtime.lastError || !response) {
        badge.clear(tab.id)
        return
      }

      badge.update(tab.id, core.normalizeEnabled(response.enabled))
    })
  })

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
      badge.clear(tabId)
    }
  })
})()
