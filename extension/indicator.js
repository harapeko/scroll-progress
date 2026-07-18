;(function (global) {
  'use strict'

  var core = global.ScrollProgressCore

  /**
   * 画面左下に出す小さな進捗表示を作る。
   *
   * @returns {HTMLDivElement}
   */
  function create() {
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

  /**
   * まだページにない場合だけ表示する。
   *
   * @param {HTMLElement} element
   */
  function show(element) {
    if (!document.getElementById(core.INDICATOR_ID)) {
      document.body.appendChild(element)
    }
  }

  /**
   * 表示中の進捗表示を外す。
   *
   * @param {HTMLElement} element
   */
  function hide(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  /**
   * 表示するパーセント値を反映する。
   *
   * @param {HTMLElement} element
   * @param {number} progress
   */
  function update(element, progress) {
    element.textContent = progress + ' %'
  }

  global.ScrollProgressIndicator = {
    create: create,
    hide: hide,
    show: show,
    update: update,
  }
})(globalThis)
