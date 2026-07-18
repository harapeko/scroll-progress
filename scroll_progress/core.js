;(function (global) {
  'use strict'

  var INDICATOR_ID = 'extension-scroll_progress'

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
   * 既知の不得意なbodyスクロール構成では動かさない。
   *
   * @param {{ overflowY: string }} bodyStyle
   * @returns {boolean}
   */
  function shouldAttachIndicator(bodyStyle) {
    return bodyStyle.overflowY !== 'auto'
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
    calculateProgress: calculateProgress,
    shouldAttachIndicator: shouldAttachIndicator,
    throttle: throttle,
  }
})(globalThis)
