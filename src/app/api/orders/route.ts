import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CustomerDetailsSchema, OrderItemSchema } from '@/models/order'

const OrderRequestSchema = z.object({
  orderId: z.string(),
  customer: CustomerDetailsSchema,
  items: z.array(OrderItemSchema),
  total: z.number(),
  outOfZone: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = OrderRequestSchema.parse(body)

    // Build email text
    const itemLines = order.items
      .map((i) => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`)
      .join('\n')

    const emailText = `
New Order — ${order.orderId}
=============================
Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Address: ${order.customer.address}, ${order.customer.city} — ${order.customer.pincode}
Notes: ${order.customer.notes ?? '—'}

Items:
${itemLines}

Total: ₹${order.total}
=============================
    `.trim()

    const apiKey = process.env.RESEND_API_KEY

    if (apiKey) {
      // Send via Resend
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      const subjectPrefix = order.outOfZone ? '[OUT OF ZONE] ' : ''
      await resend.emails.send({
        from: 'orders@alprra.com',
        to: process.env.ORDER_NOTIFY_EMAIL ?? 'orders@alprra.com',
        subject: `${subjectPrefix}New Order ${order.orderId} — ₹${order.total}`,
        text: emailText,
      })
    } else {
      // Dev fallback — log to console
      console.log('[ORDER]', emailText)
    }

    return NextResponse.json({ success: true, orderId: order.orderId })
  } catch (error) {
    console.error('[ORDER_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid order data', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
