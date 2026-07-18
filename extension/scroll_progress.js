;(function () {
  'use strict'

  var core = globalThis.ScrollProgressCore
  var indicator = globalThis.ScrollProgressIndicator.create()
  var enabled = true

  function showIndicator() {
    if (!document.getElementById(core.INDICATOR_ID)) {
      document.body.appendChild(indicator)
    }
  }

  function hideIndicator() {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator)
    }
  }

  function updateProgress() {
    if (!enabled) {
      return
    }

    var scrollingElement = document.scrollingElement || document.documentElement
    var progress = core.calculateProgress(
      scrollingElement.scrollTop,
      document.body.scrollHeight,
      window.innerHeight
    )

    if (progress === null) {
      return
    }

    showIndicator()
    indicator.textContent = progress + ' %'
  }

  function applyEnabled(value) {
    enabled = core.normalizeEnabled(value)

    if (!enabled) {
      hideIndicator()
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
