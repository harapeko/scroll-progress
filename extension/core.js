;(function (global) {
  'use strict'

  var INDICATOR_ID = 'extension-scroll_progress'
  var TOGGLE_MESSAGE_TYPE = 'toggle-scroll-progress'

  /**
   * スクロール量を0から100の整数に丸める。
   *
   * @param {number} scrollTop
   * @param {number} scrollHeight
   * @param {number} viewportHeight
   * @returns {number | null}
   */
  function calculateProgress(scrollTop, scrollHeight, viewportHeight) {
    var scrollableHeight = scrollHeight - viewportHeight

    if (scrollableHeight <= 0) {
      return null
    }

    var progress = (scrollTop / scrollableHeight) * 100

    return Math.round(Math.max(Math.min(progress, 100), 0))
  }

  /**
   * document/windowから現在のスクロール率を計算する。
   *
   * @param {{ scrollingElement?: { scrollTop: number } | null, documentElement: { scrollTop: number }, body: { scrollHeight: number } }} documentObject
   * @param {{ innerHeight: number }} windowObject
   * @returns {number | null}
   */
  function calculateDocumentProgress(documentObject, windowObject) {
    var scrollingElement = documentObject.scrollingElement || documentObject.documentElement

    return calculateProgress(
      scrollingElement.scrollTop,
      documentObject.body.scrollHeight,
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
   * 明示的なfalse以外は、既定どおり表示する。
   *
   * @param {unknown} value
   * @returns {boolean}
   */
  function normalizeEnabled(value) {
    return value !== false
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
    return Boolean(message && message.type === TOGGLE_MESSAGE_TYPE)
  }

  /**
   * toggle後の状態をresponseとして返す。
   *
   * @param {unknown} enabled
   * @returns {{ enabled: boolean }}
   */
  function createToggleResponse(enabled) {
    return { enabled: normalizeEnabled(enabled) }
  }

  /**
   * background側でresponseから有効状態を読む。
   *
   * @param {unknown} response
   * @returns {boolean | null}
   */
  function readEnabledResponse(response) {
    if (!response || typeof response.enabled === 'undefined') {
      return null
    }

    return normalizeEnabled(response.enabled)
  }

  /**
   * badgeへ表示する文字を決める。
   *
   * @param {unknown} enabled
   * @returns {string}
   */
  function getBadgeText(enabled) {
    return normalizeEnabled(enabled) ? '' : 'OFF'
  }

  /**
   * indicatorへ表示する文字を作る。
   *
   * @param {number} progress
   * @returns {string}
   */
  function getIndicatorText(progress) {
    return progress + ' %'
  }

  /**
   * ページ本文の選択やコピーに、拡張の表示文字を混ぜない。
   *
   * @param {{ setAttribute: Function, style: Object }} element
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
   * @param {Function} callback
   * @param {number} wait
   * @returns {Function}
   */
  function throttle(callback, wait) {
    var timeout = null
    var previous = 0

    return function () {
      var now = Date.now()
      var remaining = wait - (now - previous)
      var context = this
      var args = arguments

      if (remaining <= 0) {
        clearTimeout(timeout)
        timeout = null
        previous = now
        return callback.apply(context, args)
      }

      if (!timeout) {
        timeout = setTimeout(function () {
          previous = Date.now()
          timeout = null
          callback.apply(context, args)
        }, remaining)
      }
    }
  }

  global.ScrollProgressCore = {
    INDICATOR_ID: INDICATOR_ID,
    TOGGLE_MESSAGE_TYPE: TOGGLE_MESSAGE_TYPE,
    calculateDocumentProgress: calculateDocumentProgress,
    calculateProgress: calculateProgress,
    createToggleMessage: createToggleMessage,
    createToggleResponse: createToggleResponse,
    getBadgeText: getBadgeText,
    getIndicatorText: getIndicatorText,
    keepIndicatorOutOfPageSelection: keepIndicatorOutOfPageSelection,
    isToggleMessage: isToggleMessage,
    normalizeEnabled: normalizeEnabled,
    readEnabledResponse: readEnabledResponse,
    shouldAttachIndicator: shouldAttachIndicator,
    throttle: throttle,
  }
})(globalThis)
