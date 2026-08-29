'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import type { OrderRow } from '@/lib/db/schema'
import { getSiteSettings } from '@/lib/db/settings.repo'
import { sendEmail } from '@/lib/email/send'
import { renderTemplate } from '@/lib/email/templates'

/** The two statuses the admin UI exposes. 'completed' is stored as the existing 'delivered' DB value. */
export type AdminOrderStatus = 'pending' | 'completed'

const UI_TO_DB_STATUS: Record<AdminOrderStatus, string> = {
  pending: 'pending',
  completed: 'delivered',
}

/**
 * Updates an order's status from the admin orders page. If this transition
 * moves the order INTO "completed" (and it wasn't already), sends the
 * customer the admin-authored completion email exactly once.
 */
export async function updateOrderStatusAction(orderId: string, uiStatus: AdminOrderStatus): Promise<void> {
  const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!existing) throw new Error('Order not found')

  const newDbStatus = UI_TO_DB_STATUS[uiStatus]
  const wasCompleted = existing.status === 'delivered'

  await db
    .update(orders)
    .set({ status: newDbStatus, updatedAt: new Date() })
    .where(eq(orders.id, orderId))

  if (uiStatus === 'completed' && !wasCompleted) {
    await sendCompletionEmail(existing)
  }

  revalidatePath('/admin/orders')
}

async function sendCompletionEmail(order: OrderRow): Promise<void> {
  const customer = order.customer as { name?: string; email?: string }
  if (!customer.email) {
    console.error('[ORDER_COMPLETION_EMAIL] Skipped — no customer email on order', order.orderNumber)
    return
  }

  const settings = await getSiteSettings()
  const vars = { name: customer.name ?? 'there', orderNumber: order.orderNumber }

  try {
    await sendEmail({
      to: customer.email,
      subject: renderTemplate(settings.orderCompletionEmailSubject, vars),
      text: renderTemplate(settings.orderCompletionEmailBody, vars),
    })
  } catch (err) {
    // Don't let an email failure block the status update the admin just made.
    console.error('[ORDER_COMPLETION_EMAIL_ERROR]', err)
  }
}
