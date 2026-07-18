;(function (global) {
  'use strict'

  const core = global.ScrollProgressCore

  /**
   * タブ終了直後など、badgeを更新できない場合は次の操作を待つ。
   *
   * @param {Promise<unknown>} promise
   */
  function ignoreBadgeUpdateFailure(promise) {
    void promise.catch(function () {
      // badgeは補助表示なので、タブ終了後の失敗は再試行しない。
    })
  }

  /**
   * @param {number} tabId
   * @param {boolean} enabled
   */
  function update(tabId, enabled) {
    ignoreBadgeUpdateFailure(
      chrome.action.setBadgeBackgroundColor({ color: '#666666', tabId: tabId })
    )
    ignoreBadgeUpdateFailure(
      chrome.action.setBadgeText({ text: core.getBadgeText(enabled), tabId: tabId })
    )
  }

  /**
   * @param {number} tabId
   */
  function clear(tabId) {
    ignoreBadgeUpdateFailure(chrome.action.setBadgeText({ text: '', tabId: tabId }))
  }

  // noinspection JSUnusedGlobalSymbols -- manifest経由で別scriptから参照する。
  global.ScrollProgressBadge = {
    clear,
    update,
  }
})(globalThis)
