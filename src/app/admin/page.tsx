import Link from 'next/link'
import { Package, ShoppingBag, ArrowRight, Plus } from 'lucide-react'
import { dbGetAllProducts } from '@/lib/db/products.repo'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export default async function AdminDashboard() {
  const [products, recentOrders] = await Promise.all([
    dbGetAllProducts(),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ])

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-espresso-600">Dashboard</h1>
        <p className="text-sm text-espresso-400 mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-forest-50 flex items-center justify-center">
            <Package className="h-6 w-6 text-forest-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-espresso-600">{products.length}</p>
            <p className="text-sm text-espresso-400">Products</p>
          </div>
          <Link href="/admin/products" className="ml-auto text-forest-600 hover:text-forest-700">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-honey-50 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-honey-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-espresso-600">{recentOrders.length}</p>
            <p className="text-sm text-espresso-400">Recent orders</p>
          </div>
          <Link href="/admin/orders" className="ml-auto text-forest-600 hover:text-forest-700">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-semibold text-espresso-600 mb-4">Quick actions</h2>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-espresso-600">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-forest-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const customer = order.customer as { name?: string; phone?: string }
              return (
                <div key={order.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-espresso-600">{order.orderNumber}</p>
                    <p className="text-xs text-espresso-400">{customer.name} · {customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-espresso-600">₹{(order.total / 100).toFixed(2)}</p>
                    <span className="inline-block rounded-full bg-honey-100 text-honey-700 text-[10px] font-semibold px-2 py-0.5 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
