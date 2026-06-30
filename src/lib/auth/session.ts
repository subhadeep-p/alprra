/**
 * Lightweight signed-cookie session for the admin console.
 * Uses Web Crypto HMAC-SHA256 — works in Next.js middleware (Edge runtime)
 * and in Node.js server code with zero external dependencies.
 */

const COOKIE_NAME = 'alprra_admin_session'
const MAX_AGE = 60 * 60 * 8 // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET env var is not set')
  return secret
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBuffer(hex: string): ArrayBuffer {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr.buffer
}

/** Create a signed session token: `<expiry>.<signature>` */
export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + MAX_AGE * 1000
  const payload = String(expiry)
  const key = await getKey(getSecret())
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${bufferToHex(sigBuf)}`
}

/** Returns true if the token is valid and not expired */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dotIdx = token.lastIndexOf('.')
    if (dotIdx === -1) return false
    const payload = token.slice(0, dotIdx)
    const sigHex = token.slice(dotIdx + 1)
    const expiry = Number(payload)
    if (isNaN(expiry) || Date.now() > expiry) return false
    const key = await getKey(getSecret())
    return crypto.subtle.verify(
      'HMAC',
      key,
      hexToBuffer(sigHex),
      new TextEncoder().encode(payload),
    )
  } catch {
    return false
  }
}

export const SESSION_COOKIE = COOKIE_NAME
export const SESSION_MAX_AGE = MAX_AGE
