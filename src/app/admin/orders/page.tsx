import { db } from '@/lib/db/client'
import { orders, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { ShoppingBag } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-honey-100 text-honey-700',
  confirmed: 'bg-forest-100 text-forest-700',
  processing: 'bg-forest-100 text-forest-700',
  shipped: 'bg-forest-200 text-forest-800',
  delivered: 'bg-forest-200 text-forest-800',
  cancelled: 'bg-terracotta-100 text-terracotta-700',
}

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select({
      order: orders,
      user: {
        id: users.id,
        phone: users.phone,
        name: users.name,
        email: users.email,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-espresso-600">Orders</h1>
        <p className="text-sm text-espresso-400 mt-1">{allOrders.length} orders total</p>
      </div>

      {allOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <ShoppingBag className="h-10 w-10 text-espresso-300 mx-auto mb-3" />
          <p className="text-espresso-500 font-medium">No orders yet</p>
          <p className="text-sm text-espresso-400 mt-1">Orders will appear here once customers check out.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Zone</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.map(({ order, user }) => {
                const customer = order.customer as {
                  name?: string; phone?: string; email?: string; address?: string; city?: string; pincode?: string
                }
                const items = order.items as Array<{ name: string; quantity: number; price: number }>
                const itemSummary = items.map((i) => `${i.name} ×${i.quantity}`).join(', ')
                const color = STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'
                const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-medium text-espresso-600">{order.orderNumber}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-espresso-600">{customer.name ?? user?.name ?? '—'}</p>
                      <p className="text-xs text-espresso-400">{customer.phone ?? user?.phone}</p>
                      {customer.city && (
                        <p className="text-xs text-espresso-300">{customer.city} — {customer.pincode}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-xs text-espresso-500 truncate">{itemSummary}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-espresso-600">₹{(order.total / 100).toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${color}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {order.outOfZone ? (
                        <span className="inline-block rounded-full bg-terracotta-50 text-terracotta-600 text-[10px] font-semibold px-2 py-0.5">
                          Out of zone
                        </span>
                      ) : (
                        <span className="text-xs text-espresso-300">In zone</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-espresso-400">{date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
