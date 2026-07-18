;(function () {
  'use strict'

  const core = globalThis.ScrollProgressCore
  const indicator = globalThis.ScrollProgressIndicator
  const indicatorElement = indicator.create()
  let enabled = true
  /** @type {Element | null} */
  let activeScrollElement = null

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

    if (activeScrollElement && !activeScrollElement.isConnected) {
      setActiveScrollElement(null)
    }

    const progress = activeScrollElement
      ? core.calculateElementProgress(activeScrollElement)
      : core.calculateDocumentProgress(document, window)

    if (progress === null) {
      indicator.hide(indicatorElement)
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

  const throttledUpdateProgress = core.throttle(updateProgress, 100)
  const activeScrollElementObserver = new ResizeObserver(throttledUpdateProgress)

  /**
   * active elementを切り替え、監視対象を1件に保つ。
   *
   * @param {Element | null} nextElement
   */
  function setActiveScrollElement(nextElement) {
    if (activeScrollElement === nextElement) {
      return
    }

    if (activeScrollElement) {
      activeScrollElementObserver.unobserve(activeScrollElement)
    }

    activeScrollElement = nextElement

    if (activeScrollElement) {
      activeScrollElementObserver.observe(activeScrollElement)
    }
  }

  /**
   * 最後に操作されたscroll areaを進捗sourceにする。
   *
  * @param {Event} event
   */
  function handleScroll(event) {
    if (event.target instanceof Element) {
      if (event.target.scrollHeight <= event.target.clientHeight) {
        return
      }

      setActiveScrollElement(event.target)
    } else {
      setActiveScrollElement(null)
    }

    throttledUpdateProgress()
  }

  /**
   * 表示開始後に必要なlistenerを登録する。
   */
  function registerListeners() {
    chrome.runtime.onMessage.addListener(handleRuntimeMessage)
    document.addEventListener('fullscreenchange', updateProgress)
    document.addEventListener('scroll', handleScroll, true)
    window.addEventListener('load', updateProgress)
    window.addEventListener('resize', throttledUpdateProgress)
  }

  /**
   * 対応できるページで進捗表示を開始する。
   */
  function start() {
    registerListeners()
    updateProgress()
  }

  start()
})()
