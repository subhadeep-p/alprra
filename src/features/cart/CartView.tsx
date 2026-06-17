'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from './cartStore'
import { QuantityStepper } from './QuantityStepper'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils/format'

export function CartView() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const total = subtotal()

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-cream-100 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-espresso-300" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-espresso-600 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Your cart is empty
        </h2>
        <p className="text-espresso-400 mb-6">Add some delicious healthy snacks to get started.</p>
        <Button asChild>
          <Link href="/products">
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Line items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 bg-white rounded-2xl border border-cream-200 p-4 shadow-[var(--shadow-card)]"
          >
            <div className="shrink-0 rounded-xl overflow-hidden bg-cream-50 w-20 h-20">
              <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain w-full h-full p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="font-semibold text-espresso-600 hover:text-forest-600 text-sm leading-snug line-clamp-2 transition-colors"
              >
                {item.name}
              </Link>
              <p className="text-sm font-bold text-espresso-600 mt-1">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3 mt-2">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.productId, q)}
                  min={1}
                />
                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-red-50 text-espresso-300 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-bold text-espresso-600">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] p-6">
          <h2 className="text-lg font-semibold text-espresso-600 mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            Order Summary
          </h2>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between text-espresso-500">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-semibold text-espresso-600">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-espresso-500">
              <span>Delivery</span>
              <span className={total >= 599 ? 'text-forest-600 font-semibold' : 'font-semibold text-espresso-600'}>
                {total >= 599 ? 'FREE' : formatPrice(60)}
              </span>
            </div>
            {total < 599 && (
              <p className="text-xs text-forest-600 bg-forest-50 rounded-lg px-3 py-2">
                Add {formatPrice(599 - total)} more for free delivery
              </p>
            )}
          </div>
          <div className="border-t border-cream-200 pt-4 mb-5">
            <div className="flex justify-between">
              <span className="font-semibold text-espresso-600">Total</span>
              <span className="text-xl font-bold text-espresso-600">
                {formatPrice(total + (total >= 599 ? 0 : 60))}
              </span>
            </div>
          </div>
          <Button className="w-full" size="lg" asChild>
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-center text-espresso-400 mt-4">
            Orders confirmed via WhatsApp in minutes
          </p>
        </div>
      </div>
    </div>
  )
}
