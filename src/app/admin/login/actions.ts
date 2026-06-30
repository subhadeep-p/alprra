'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth/session'

/** Timing-safe string comparison to prevent timing attacks */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // still do the comparison to avoid timing leak from early return
    let diff = 0
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diff |= (a.charCodeAt(i) ?? 0) ^ (b.charCodeAt(i) ?? 0)
    }
    return false
  }
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function loginAction(formData: FormData) {
  const username = (formData.get('username') as string | null) ?? ''
  const password = (formData.get('password') as string | null) ?? ''
  const from = (formData.get('from') as string | null) ?? '/admin'

  const expectedUser = process.env.ADMIN_USERNAME ?? ''
  const expectedPass = process.env.ADMIN_PASSWORD ?? ''

  const valid = safeEqual(username, expectedUser) && safeEqual(password, expectedPass)

  if (!valid) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`)
  }

  const token = await createSessionToken()
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  redirect(from.startsWith('/admin') ? from : '/admin')
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  redirect('/admin/login')
}
