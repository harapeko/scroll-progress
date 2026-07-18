export {}

declare global {
  interface ScrollProgressElement {
    scrollHeight: number
    scrollTop: number
  }

  interface ScrollProgressDocument {
    documentElement: ScrollProgressElement
    scrollingElement?: ScrollProgressElement | null
  }

  interface IndicatorSelectionElement {
    setAttribute(name: string, value: string): void
    style: {
      pointerEvents?: string
      userSelect?: string
      webkitUserSelect?: string
    }
  }

  interface ScrollProgressCoreApi {
    readonly INDICATOR_ID: string
    readonly TOGGLE_MESSAGE_TYPE: string
    calculateDocumentProgress(
      documentObject: ScrollProgressDocument,
      windowObject: { innerHeight: number },
    ): number | null
    calculateProgress(
      scrollTop: number,
      scrollHeight: number,
      viewportHeight: number,
    ): number | null
    createToggleMessage(): { type: string }
    createToggleResponse(enabled: unknown): { enabled: boolean }
    getBadgeText(enabled: unknown): string
    getIndicatorText(progress: number): string
    isToggleMessage(message: unknown): boolean
    keepIndicatorOutOfPageSelection(element: IndicatorSelectionElement): void
    normalizeEnabled(value: unknown): boolean
    readEnabledResponse(response: unknown): boolean | null
    shouldAttachIndicator(bodyStyle: { overflowY: string }): boolean
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
