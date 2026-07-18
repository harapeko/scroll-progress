importScripts('core.js')

;(function () {
  'use strict'

  var core = globalThis.ScrollProgressCore

  function updateBadge(tabId, enabled) {
    chrome.action.setBadgeBackgroundColor({ color: '#666666', tabId: tabId })
    chrome.action.setBadgeText({ text: enabled ? '' : 'OFF', tabId: tabId })
  }

  function clearBadge(tabId) {
    chrome.action.setBadgeText({ text: '', tabId: tabId })
  }

  chrome.action.onClicked.addListener(function (tab) {
    if (typeof tab.id !== 'number') {
      return
    }

    chrome.tabs.sendMessage(tab.id, { type: core.TOGGLE_MESSAGE_TYPE }, function (response) {
      if (chrome.runtime.lastError || !response) {
        clearBadge(tab.id)
        return
      }

      updateBadge(tab.id, core.normalizeEnabled(response.enabled))
    })
  })

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
      clearBadge(tabId)
    }
  })
})()
