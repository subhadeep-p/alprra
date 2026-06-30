import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CustomerDetailsSchema, OrderItemSchema } from '@/models/order'
import { db } from '@/lib/db/client'
import { users, orders } from '@/lib/db/schema'
import { rupeesToPaise } from '@/lib/db/products.repo'
import { sql } from 'drizzle-orm'

const OrderRequestSchema = z.object({
  orderId: z.string(),
  customer: CustomerDetailsSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number().optional(),
  total: z.number(),
  outOfZone: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = OrderRequestSchema.parse(body)

    // ------------------------------------------------------------------
    // 1. Persist to DB: upsert user by phone, then insert order
    // ------------------------------------------------------------------
    let userId: string | undefined

    try {
      // Upsert user — phone is the unique identifier for logged-out customers.
      // If the same phone reorders, we update name/email and keep order history.
      const [savedUser] = await db
        .insert(users)
        .values({
          phone: order.customer.phone,
          name: order.customer.name,
          email: order.customer.email,
          defaultAddress: {
            address: order.customer.address,
            city: order.customer.city,
            pincode: order.customer.pincode,
          },
        })
        .onConflictDoUpdate({
          // Matches the partial unique index: UNIQUE (phone) WHERE phone IS NOT NULL
          target: users.phone,
          targetWhere: sql`${users.phone} is not null`,
          set: {
            name: order.customer.name,
            email: order.customer.email,
            defaultAddress: {
              address: order.customer.address,
              city: order.customer.city,
              pincode: order.customer.pincode,
            },
            updatedAt: new Date(),
          },
        })
        .returning({ id: users.id })

      userId = savedUser.id

      const subtotalRupees = order.subtotal ?? order.total
      const deliveryFeeRupees = order.total - subtotalRupees

      await db.insert(orders).values({
        orderNumber: order.orderId,
        userId,
        customer: order.customer,
        items: order.items,
        subtotal: rupeesToPaise(subtotalRupees),
        deliveryFee: rupeesToPaise(deliveryFeeRupees),
        discount: 0,
        total: rupeesToPaise(order.total),
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        outOfZone: order.outOfZone ?? false,
      })
    } catch (dbError) {
      // DB persistence failure should not silently lose the order —
      // log loudly but still send the notification email below.
      console.error('[ORDER_DB_ERROR]', dbError)
    }

    // ------------------------------------------------------------------
    // 2. Send internal notification email (existing Resend logic)
    // ------------------------------------------------------------------
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
