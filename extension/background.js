importScripts('core.js', 'badge.js')

;(function () {
  'use strict'

  const core = globalThis.ScrollProgressCore
  const badge = globalThis.ScrollProgressBadge

  /**
   * content scriptから返った状態をbadgeへ反映する。
   *
   * @param {number} tabId
   * @param {unknown} response
   */
  function updateBadgeFromResponse(tabId, response) {
    const enabled = chrome.runtime.lastError
      ? null
      : core.readEnabledResponse(response)

    // 送信失敗または不正なresponseでは、古い表示を残さない。
    if (enabled === null) {
      badge.clear(tabId)
      return
    }

    badge.update(tabId, enabled)
  }

  /**
   * actionを押したタブへtoggle要求を送る。
   *
   * @param {chrome.tabs.Tab} tab
   */
  function handleActionClick({ id: tabId }) {
    if (typeof tabId !== 'number') {
      return
    }

    // noinspection JSIgnoredPromiseFromCall -- callback版はPromiseを返さない。
    chrome.tabs.sendMessage(tabId, core.createToggleMessage(), function (response) {
      updateBadgeFromResponse(tabId, response)
    })
  }

  /**
   * ページ遷移が始まったタブのbadgeを戻す。
   *
   * @param {number} tabId
   * @param {chrome.tabs.OnUpdatedInfo} changeInfo
   */
  function handleTabUpdated(tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
      badge.clear(tabId)
    }
  }

  chrome.action.onClicked.addListener(handleActionClick)
  chrome.tabs.onUpdated.addListener(handleTabUpdated)
})()
