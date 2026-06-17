export type Platform = 'ios' | 'android' | 'web'

export interface SharePayload {
  title: string
  text: string
  url?: string
}

export interface NativeBridge {
  platform: Platform
  openExternal: (url: string) => void
  share: (payload: SharePayload) => void
  vibrate: (pattern?: number[]) => void
  // Stubs for future phases
  pay?: (amount: number, currency: string, orderId: string) => Promise<{ success: boolean }>
  notify?: (title: string, body: string) => void
}

// Shape the native team injects on window
declare global {
  interface Window {
    AlprraNative?: Partial<NativeBridge> & { platform: Platform }
  }
}
