export {}

declare global {
  interface ScrollProgressMetrics {
    scrollHeight: number
    scrollTop: number
  }

  interface ScrollProgressElement extends ScrollProgressMetrics {
    clientHeight: number
  }

  interface ScrollProgressDocument {
    documentElement: ScrollProgressMetrics
    scrollingElement?: ScrollProgressMetrics | null
  }

  interface ScrollProgressCoreApi {
    readonly INDICATOR_ID: string
    calculateDocumentProgress(
      documentObject: ScrollProgressDocument,
      windowObject: { innerHeight: number },
    ): number | null
    calculateElementProgress(element: ScrollProgressElement): number | null
    calculateProgress(
      scrollTop: number,
      scrollHeight: number,
      viewportHeight: number,
    ): number | null
    createToggleMessage(): { type: string }
    createToggleResponse(enabled: boolean): { enabled: boolean }
    getBadgeText(enabled: boolean): string
    getIndicatorText(progress: number): string
    isToggleMessage(message: unknown): boolean
    readEnabledResponse(response: unknown): boolean | null
    throttle(callback: () => void, wait: number): () => void
  }

  interface ScrollProgressIndicatorApi {
    create(): HTMLDivElement
    hide(element: HTMLElement): void
    show(element: HTMLElement): void
    update(element: HTMLElement, progress: number): void
  }

  interface ScrollProgressBadgeApi {
    clear(tabId: number): void
    update(tabId: number, enabled: boolean): void
  }

  var ScrollProgressCore: ScrollProgressCoreApi
  var ScrollProgressIndicator: ScrollProgressIndicatorApi
  var ScrollProgressBadge: ScrollProgressBadgeApi

  function importScripts(...urls: string[]): void
}
