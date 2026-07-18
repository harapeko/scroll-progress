;(function (global) {
  'use strict'

  const INDICATOR_ID = 'extension-scroll_progress'
  const TOGGLE_MESSAGE_TYPE = 'toggle-scroll-progress'

  /**
   * スクロール量を0から100の整数に丸める。
   *
   * @param {number} scrollTop
   * @param {number} scrollHeight
   * @param {number} viewportHeight
   * @returns {number | null}
   */
  function calculateProgress(scrollTop, scrollHeight, viewportHeight) {
    const scrollableHeight = scrollHeight - viewportHeight

    if (scrollableHeight <= 0) {
      return null
    }

    const progress = (scrollTop / scrollableHeight) * 100
    const boundedProgress = Math.min(Math.max(progress, 0), 100)

    return Math.round(boundedProgress)
  }

  /**
   * document/windowから現在のスクロール率を計算する。
   *
   * @param {ScrollProgressDocument} documentObject
   * @param {{ innerHeight: number }} windowObject
   * @returns {number | null}
   */
  function calculateDocumentProgress(documentObject, windowObject) {
    const scrollingElement = documentObject.scrollingElement ?? documentObject.documentElement

    return calculateProgress(
      scrollingElement.scrollTop,
      scrollingElement.scrollHeight,
      windowObject.innerHeight
    )
  }

  /**
   * 既知の不得意なbodyスクロール構成では動かさない。
   *
   * @param {{ overflowY: string }} bodyStyle
   * @returns {boolean}
   */
  function shouldAttachIndicator(bodyStyle) {
    return bodyStyle.overflowY !== 'auto'
  }

  /**
   * content scriptへ送るtoggle messageを作る。
   *
   * @returns {{ type: string }}
   */
  function createToggleMessage() {
    return { type: TOGGLE_MESSAGE_TYPE }
  }

  /**
   * 受け取ったmessageがtoggle用かを判定する。
   *
   * @param {unknown} message
   * @returns {boolean}
   */
  function isToggleMessage(message) {
    if (typeof message !== 'object' || message === null || !('type' in message)) {
      return false
    }

    return message.type === TOGGLE_MESSAGE_TYPE
  }

  /**
   * toggle後の状態をresponseとして返す。
   *
   * @param {boolean} enabled
   * @returns {{ enabled: boolean }}
   */
  function createToggleResponse(enabled) {
    return { enabled }
  }

  /**
   * background側でresponseから有効状態を読む。
   *
   * @param {unknown} response
   * @returns {boolean | null}
   */
  function readEnabledResponse(response) {
    if (
      typeof response !== 'object' ||
      response === null ||
        !('enabled' in response) ||
        typeof response.enabled !== 'boolean'
    ) {
      return null
    }

    return response.enabled
  }

  /**
   * badgeへ表示する文字を決める。
   *
   * @param {boolean} enabled
   * @returns {string}
   */
  function getBadgeText(enabled) {
    return enabled ? '' : 'OFF'
  }

  /**
   * indicatorへ表示する文字を作る。
   *
   * @param {number} progress
   * @returns {string}
   */
  function getIndicatorText(progress) {
    return `${progress} %`
  }

  /**
   * ページ本文の選択やコピーに、拡張の表示文字を混ぜない。
   *
   * @param {IndicatorSelectionElement} element
   */
  function keepIndicatorOutOfPageSelection(element) {
    element.setAttribute('aria-hidden', 'true')
    element.style.pointerEvents = 'none'
    element.style.userSelect = 'none'
    element.style.webkitUserSelect = 'none'
  }

  /**
   * 指定時間内の呼び出し回数を抑える。
   *
   * @param {() => void} callback
   * @param {number} wait
   * @returns {() => void}
   */
  function throttle(callback, wait) {
    /** @type {ReturnType<typeof setTimeout> | null} */
    let trailingTimeout = null
    let lastInvocationTime = 0

    return function () {
      const now = Date.now()
      const remainingWait = wait - (now - lastInvocationTime)

      if (remainingWait <= 0) {
        if (trailingTimeout !== null) {
          clearTimeout(trailingTimeout)
        }
        trailingTimeout = null
        lastInvocationTime = now
        callback()
        return
      }

      if (trailingTimeout === null) {
        trailingTimeout = setTimeout(function () {
          lastInvocationTime = Date.now()
          trailingTimeout = null
          callback()
        }, remainingWait)
      }
    }
  }

  // noinspection JSUnusedGlobalSymbols -- manifest経由で別scriptから参照する。
  global.ScrollProgressCore = {
    INDICATOR_ID,
    calculateDocumentProgress,
    calculateProgress,
    createToggleMessage,
    createToggleResponse,
    getBadgeText,
    getIndicatorText,
    keepIndicatorOutOfPageSelection,
    isToggleMessage,
    readEnabledResponse,
    shouldAttachIndicator,
    throttle,
  }
})(globalThis)
