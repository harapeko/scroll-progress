importScripts('core.js', 'badge.js')

;(function () {
  'use strict'

  var core = globalThis.ScrollProgressCore
  var badge = globalThis.ScrollProgressBadge

  chrome.action.onClicked.addListener(function (tab) {
    if (typeof tab.id !== 'number') {
      return
    }

    chrome.tabs.sendMessage(tab.id, core.createToggleMessage(), function (response) {
      var enabled = core.readEnabledResponse(response)

      if (chrome.runtime.lastError || enabled === null) {
        badge.clear(tab.id)
        return
      }

      badge.update(tab.id, enabled)
    })
  })

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
      badge.clear(tabId)
    }
  })
})()
