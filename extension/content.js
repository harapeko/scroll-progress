;(function () {
  'use strict'

  const core = globalThis.ScrollProgressCore
  const indicator = globalThis.ScrollProgressIndicator
  const indicatorElement = indicator.create()
  let enabled = true

  /**
   * 現在位置をindicatorへ反映する。
   */
  function updateProgress() {
    if (!enabled) {
      return
    }

    if (document.fullscreenElement) {
      indicator.hide(indicatorElement)
      return
    }

    const progress = core.calculateDocumentProgress(document, window)

    if (progress === null) {
      return
    }

    indicator.show(indicatorElement)
    indicator.update(indicatorElement, progress)
  }

  /**
   * このタブ内の表示状態を切り替える。
   *
   * @param {boolean} nextEnabled
   */
  function setEnabled(nextEnabled) {
    enabled = nextEnabled

    if (!enabled) {
      indicator.hide(indicatorElement)
      return
    }

    updateProgress()
  }

  /**
   * 現在の表示状態を反転する。
   *
   * @returns {boolean}
   */
  function toggleEnabled() {
    setEnabled(!enabled)
    return enabled
  }

  /**
   * backgroundから届いたtoggle要求へ応答する。
   *
   * @param {unknown} message
   * @param {chrome.runtime.MessageSender} _sender
   * @param {(response: { enabled: boolean }) => void} sendResponse
   */
  function handleRuntimeMessage(message, _sender, sendResponse) {
    if (!core.isToggleMessage(message)) {
      return
    }

    sendResponse(core.createToggleResponse(toggleEnabled()))
  }

  /**
   * 表示開始後に必要なlistenerを登録する。
   */
  function registerListeners() {
    chrome.runtime.onMessage.addListener(handleRuntimeMessage)
    document.addEventListener('fullscreenchange', updateProgress)
    window.addEventListener('load', updateProgress)
    window.addEventListener('scroll', core.throttle(updateProgress, 100))
  }

  /**
   * 対応できるページで進捗表示を開始する。
   */
  function start() {
    // body側がスクロール本体になるページは、既存仕様どおり対象外にする。
    if (!core.shouldAttachIndicator(getComputedStyle(document.body))) {
      return
    }

    registerListeners()
    updateProgress()
  }

  start()
})()
