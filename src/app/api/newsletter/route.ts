import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => Object.fromEntries(new URL(req.url).searchParams))
    const { email } = schema.parse(body)
    // TODO: integrate with email marketing provider (Mailchimp, Klaviyo, etc.)
    console.log('[NEWSLETTER]', email)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
