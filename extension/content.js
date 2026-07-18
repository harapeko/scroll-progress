;(function () {
  'use strict'

  var core = globalThis.ScrollProgressCore
  var indicator = globalThis.ScrollProgressIndicator
  var indicatorElement = indicator.create()
  var enabled = true

  function updateProgress() {
    if (!enabled) {
      return
    }

    var progress = core.calculateDocumentProgress(document, window)

    if (progress === null) {
      return
    }

    indicator.show(indicatorElement)
    indicator.update(indicatorElement, progress)
  }

  function applyEnabled(value) {
    enabled = core.normalizeEnabled(value)

    if (!enabled) {
      indicator.hide(indicatorElement)
      return
    }

    updateProgress()
  }

  function toggleEnabled() {
    applyEnabled(!enabled)
    return enabled
  }

  function listenForToggle() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (!message || message.type !== core.TOGGLE_MESSAGE_TYPE) {
        return undefined
      }

      sendResponse({ enabled: toggleEnabled() })
      return undefined
    })
  }

  // body側がスクロール本体になるページは、既存仕様どおり対象外にする。
  if (core.shouldAttachIndicator(getComputedStyle(document.body))) {
    listenForToggle()
    updateProgress()
    window.addEventListener('load', core.throttle(updateProgress, 0))
    window.addEventListener('scroll', core.throttle(updateProgress, 100))
  }
})()
