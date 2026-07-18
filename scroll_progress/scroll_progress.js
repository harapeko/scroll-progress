;(function () {
  'use strict'

  var core = globalThis.ScrollProgressCore
  var indicator = createIndicator()
  var enabled = true

  /**
   * 画面左下に出す小さな進捗表示を作る。
   *
   * @returns {HTMLDivElement}
   */
  function createIndicator() {
    var element = document.createElement('div')
    element.setAttribute('id', core.INDICATOR_ID)
    element.textContent = '0 %'
    element.style.position = 'fixed'
    element.style.left = '0'
    element.style.bottom = '0'
    element.style.zIndex = '99999999'
    element.style.padding = '3px'
    element.style.fontSize = '9px'
    element.style.lineHeight = '1.2'
    element.style.background = '#eee'
    element.style.border = '1px solid #aaa'
    element.style.borderRadius = '0 3px 0 0'
    core.keepIndicatorOutOfPageSelection(element)

    return element
  }

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
