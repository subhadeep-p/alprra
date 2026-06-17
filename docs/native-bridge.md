# Alprra Native WebView Bridge — Interface Contract

## Overview

The Alprra web app detects a native WebView shell by checking for `window.AlprraNative`.
The native team (iOS / Android) injects this object before the web page loads.

All methods **must fall back gracefully** — the web app works in a browser without any native object.

## Required interface

```typescript
interface AlprraNative {
  platform: 'ios' | 'android'
  openExternal: (url: string) => void
  share: (payload: { title: string; text: string; url?: string }) => void
  vibrate: (pattern?: number[]) => void
}

// Injected on window before first paint:
window.AlprraNative = { ... }
```

## Method contracts

### `openExternal(url: string): void`
Called for all external links: WhatsApp (`wa.me`), `tel:`, `mailto:`, social media.
The shell should open these in the appropriate native app (WhatsApp, Phone, Mail).

### `share(payload): void`
Called when the user taps a share button.
`payload.title` — share sheet title
`payload.text` — share body text
`payload.url` — URL to share (optional)

### `vibrate(pattern?: number[]): void`
Called for haptic feedback (e.g., add-to-cart confirmation).
`pattern` defaults to `[10]` (10ms single tap).

## Detection (web side)

```typescript
// lib/native/bridge.ts
export function isNativeApp(): boolean {
  return Boolean(window.AlprraNative)
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  return window.AlprraNative?.platform ?? 'web'
}
```

## Future stubs (Phase 3+)

These will be added to the interface in future phases:

```typescript
// Payment (Razorpay/UPI integration)
pay?: (amount: number, currency: string, orderId: string) => Promise<{ success: boolean }>

// Push notifications
notify?: (title: string, body: string) => void
```

## CSS / viewport requirements met by the web app

- `viewport-fit=cover` in the HTML meta tag
- `env(safe-area-inset-*)` padding on header and footer
- `100dvh` used everywhere (never `100vh`)
- All hover effects gated behind `@media (hover: hover)` — touch devices never see hover-only affordances
- Minimum 44px tap targets on all interactive elements
- `overscroll-behavior-y: none` to prevent rubber-banding
- `-webkit-overflow-scrolling: touch` for momentum scroll

## User-agent detection (fallback)

If injecting `window.AlprraNative` is not possible, the shell can inject a custom UA string containing `AlprraApp/1.0` and the web app will detect it:

```typescript
const isAlprraApp = navigator.userAgent.includes('AlprraApp/')
```
