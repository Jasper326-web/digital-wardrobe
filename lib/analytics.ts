"use client"

// 轻量封装 Umami 事件上报，自动忽略未加载或未配置的情况

type EventData = Record<string, string | number | boolean | null | undefined>

export function trackEvent(eventName: string, data?: EventData) {
  try {
    if (typeof window === 'undefined') return
    const umami: any = (window as any).umami
    if (!umami || typeof umami.track !== 'function') return
    if (data) {
      umami.track(eventName, data)
    } else {
      umami.track(eventName)
    }
  } catch {
    // 忽略上报错误，避免影响业务流程
  }
}

export function trackView(path?: string) {
  try {
    if (typeof window === 'undefined') return
    const umami: any = (window as any).umami
    if (!umami || typeof umami.trackView !== 'function') return
    umami.trackView(path || window.location.pathname)
  } catch {
    // 忽略
  }
}


