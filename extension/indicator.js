;(function (global) {
  'use strict'

  const core = global.ScrollProgressCore

  /**
   * 画面左下に出す小さな進捗表示を作る。
   *
   * @returns {HTMLDivElement}
   */
  function create() {
    const element = document.createElement('div')
    element.id = core.INDICATOR_ID
    element.setAttribute('aria-hidden', 'true')
    element.textContent = core.getIndicatorText(0)
    element.style.all = 'initial'
    element.style.position = 'fixed'
    element.style.left = '0'
    element.style.bottom = '0'
    element.style.zIndex = '99999999'
    element.style.boxSizing = 'border-box'
    element.style.padding = '3px'
    element.style.color = '#111'
    element.style.fontFamily = 'Arial, sans-serif'
    element.style.fontSize = '9px'
    element.style.fontWeight = '400'
    element.style.lineHeight = '1.2'
    element.style.direction = 'ltr'
    element.style.whiteSpace = 'nowrap'
    element.style.background = '#eee'
    element.style.border = '1px solid #aaa'
    element.style.borderRadius = '0 3px 0 0'
    element.style.pointerEvents = 'none'
    element.style.userSelect = 'none'

    return element
  }

  /**
   * まだページにない場合だけ表示する。
   *
   * @param {HTMLElement} element
   */
  function show(element) {
    if (!element.isConnected) {
      document.documentElement.appendChild(element)
    }
  }

  /**
   * 表示中の進捗表示を外す。
   *
   * @param {HTMLElement} element
   */
  function hide(element) {
    element.remove()
  }

  /**
   * 表示するパーセント値を反映する。
   *
   * @param {HTMLElement} element
   * @param {number} progress
   */
  function update(element, progress) {
    element.textContent = core.getIndicatorText(progress)
  }

  // noinspection JSUnusedGlobalSymbols -- manifest経由で別scriptから参照する。
  global.ScrollProgressIndicator = {
    create,
    hide,
    show,
    update,
  }
})(globalThis)
