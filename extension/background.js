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
  function applyToggleResponse(tabId, response) {
    const enabled = core.readEnabledResponse(response)

    // 受信先がない場合やresponseが不正な場合は、古い表示を残さない。
    if (chrome.runtime.lastError || enabled === null) {
      badge.clear(tabId)
      return
    }

    badge.update(tabId, enabled)
  }

  /**
   * actionを押したタブへtoggle要求を送る。
   *
   * @param {{ id?: number }} tab
   */
  function handleActionClick(tab) {
    if (typeof tab.id !== 'number') {
      return
    }

    chrome.tabs.sendMessage(tab.id, core.createToggleMessage(), function (response) {
      applyToggleResponse(tab.id, response)
    })
  }

  /**
   * ページ遷移が始まったタブのbadgeを戻す。
   *
   * @param {number} tabId
   * @param {{ status?: string }} changeInfo
   */
  function handleTabUpdated(tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
      badge.clear(tabId)
    }
  }

  chrome.action.onClicked.addListener(handleActionClick)
  chrome.tabs.onUpdated.addListener(handleTabUpdated)
})()
