import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db/client'
import { newsletterSubscribers } from '@/lib/db/schema'

const schema = z.object({ email: z.string().trim().toLowerCase().email() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => Object.fromEntries(new URL(req.url).searchParams))
    const { email } = schema.parse(body)

    try {
      // Dedupe on email — repeated signups are a no-op, not an error.
      await db
        .insert(newsletterSubscribers)
        .values({ email, source: 'footer' })
        .onConflictDoNothing({ target: newsletterSubscribers.email })
    } catch (dbError) {
      // Don't fail the UX over a storage hiccup; log loudly for follow-up.
      console.error('[NEWSLETTER_DB_ERROR]', dbError)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
