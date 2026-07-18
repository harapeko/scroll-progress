;(function (global) {
  'use strict'

  const core = global.ScrollProgressCore

  /**
   * @param {number} tabId
   * @param {boolean} enabled
   */
  function update(tabId, enabled) {
    chrome.action.setBadgeBackgroundColor({ color: '#666666', tabId: tabId })
    chrome.action.setBadgeText({ text: core.getBadgeText(enabled), tabId: tabId })
  }

  /**
   * @param {number} tabId
   */
  function clear(tabId) {
    chrome.action.setBadgeText({ text: '', tabId: tabId })
  }

  // noinspection JSUnusedGlobalSymbols -- manifest経由で別scriptから参照する。
  global.ScrollProgressBadge = {
    clear: clear,
    update: update,
  }
})(globalThis)
