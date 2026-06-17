'use client'

import type { Platform, SharePayload } from './types'

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(window.AlprraNative)
}

export function getPlatform(): Platform {
  if (typeof window === 'undefined') return 'web'
  return window.AlprraNative?.platform ?? 'web'
}

export function openExternal(url: string): void {
  if (typeof window === 'undefined') return

  if (isNativeApp() && window.AlprraNative?.openExternal) {
    window.AlprraNative.openExternal(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export async function share(payload: SharePayload): Promise<void> {
  if (isNativeApp() && window.AlprraNative?.share) {
    window.AlprraNative.share(payload)
    return
  }

  // Web Share API fallback
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(payload)
      return
    } catch {
      // User cancelled or API not available — fall through
    }
  }

  // Final fallback: copy to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(payload.url ?? payload.text)
  }
}

export function vibrate(pattern: number[] = [10]): void {
  if (isNativeApp() && window.AlprraNative?.vibrate) {
    window.AlprraNative.vibrate(pattern)
    return
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}
