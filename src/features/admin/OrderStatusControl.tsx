'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatusAction, type AdminOrderStatus } from '@/app/admin/orders/actions'

const STATUS_LABELS: Record<AdminOrderStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
}

const STATUS_CLASSES: Record<AdminOrderStatus, string> = {
  pending: 'bg-honey-100 text-honey-700',
  completed: 'bg-forest-200 text-forest-800',
}

interface OrderStatusControlProps {
  orderId: string
  /** Current status, already mapped from the DB value ('delivered' -> 'completed'). */
  status: AdminOrderStatus
}

export function OrderStatusControl({ orderId, status }: OrderStatusControlProps) {
  const [current, setCurrent] = useState(status)
  const [isPending, startTransition] = useTransition()

  function handleChange(next: AdminOrderStatus) {
    if (next === current) return
    const previous = current
    setCurrent(next) // optimistic
    startTransition(async () => {
      try {
        await updateOrderStatusAction(orderId, next)
      } catch (err) {
        console.error('[ORDER_STATUS_UPDATE_ERROR]', err)
        setCurrent(previous) // roll back on failure
      }
    })
  }

  return (
    <select
      value={current}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as AdminOrderStatus)}
      className={`rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold capitalize cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-forest-400 ${STATUS_CLASSES[current]}`}
      aria-label="Order status"
    >
      {(Object.keys(STATUS_LABELS) as AdminOrderStatus[]).map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  )
}
