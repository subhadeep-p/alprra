'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/features/cart/cartStore'
import { CheckoutFormSchema, type CheckoutFormValues } from '@/models/order'
import { formatPrice, generateOrderId } from '@/lib/utils/format'
import { openExternal } from '@/lib/native/bridge'
import { siteConfig } from '@/config/site'

function buildWhatsAppMessage(
  orderId: string,
  customer: CheckoutFormValues,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): string {
  const itemLines = items.map((i) => `• ${i.name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join('\n')
  return [
    `*New Order from Alprra — ${orderId}*`,
    '',
    `*Customer:* ${customer.name}`,
    `*Phone:* ${customer.phone}`,
    `*Email:* ${customer.email}`,
    `*Address:* ${customer.address}, ${customer.city} — ${customer.pincode}`,
    customer.notes ? `*Notes:* ${customer.notes}` : '',
    '',
    '*Order Items:*',
    itemLines,
    '',
    `*Total: ${formatPrice(total)}*`,
    '',
    'Please confirm this order and share an expected delivery date. Thank you!',
  ]
    .filter((l) => l !== undefined)
    .join('\n')
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)

  const total = subtotal()
  const deliveryFee = total >= 599 ? 0 : 60
  const grandTotal = total + deliveryFee

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(CheckoutFormSchema) })

  async function onSubmit(data: CheckoutFormValues) {
    if (items.length === 0) return
    setSubmitting(true)
    const orderId = generateOrderId()

    try {
      // 1. Send to server for email notification (fire-and-forget)
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, customer: data, items, total: grandTotal }),
      }).catch(() => {}) // non-blocking

      // 2. Open WhatsApp with structured message
      const message = buildWhatsAppMessage(orderId, data, items, grandTotal)
      const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`

      // Store order id for success page
      sessionStorage.setItem('alprra-last-order', orderId)

      // Clear cart before navigation
      clearCart()

      // Open WhatsApp (through native bridge if in WebView)
      openExternal(waUrl)

      // Navigate to success
      router.push(`/checkout/success?order=${orderId}`)
    } catch {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-espresso-400 mb-4">Your cart is empty. Add some products first.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5" noValidate>
        <div className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] p-6">
          <h2 className="text-lg font-semibold text-espresso-600 mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            Delivery details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full name"
              placeholder="Priya Sharma"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Mobile number"
              placeholder="9876543210"
              type="tel"
              required
              hint="10-digit Indian mobile number"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Email address"
              placeholder="priya@example.com"
              type="email"
              required
              error={errors.email?.message}
              className="sm:col-span-2"
              {...register('email')}
            />
            <Textarea
              label="Full delivery address"
              placeholder="Flat / House no., Street, Area, Landmark..."
              required
              error={errors.address?.message}
              className="sm:col-span-2"
              rows={3}
              {...register('address')}
            />
            <Input
              label="City"
              placeholder="Bengaluru"
              required
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="Pincode"
              placeholder="560001"
              required
              error={errors.pincode?.message}
              {...register('pincode')}
            />
            <Textarea
              label="Order notes (optional)"
              placeholder="Any special instructions, allergies, or requests..."
              className="sm:col-span-2"
              rows={2}
              {...register('notes')}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="bg-forest-50 rounded-2xl border border-forest-100 p-5">
          <div className="flex items-start gap-3 mb-4">
            <MessageCircle className="h-5 w-5 text-forest-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-espresso-600">How ordering works</p>
              <p className="text-xs text-espresso-400 mt-1">
                After confirming your details, you will be redirected to WhatsApp with a pre-filled
                order message. Send it to our team and we will confirm your order and delivery slot
                within minutes. You will also receive an email confirmation.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            className="w-full"
          >
            <MessageCircle className="h-4 w-4" />
            {submitting ? 'Processing...' : 'Confirm Order via WhatsApp'}
          </Button>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-espresso-400">
            <Mail className="h-3 w-3" />
            Email confirmation sent automatically
          </div>
        </div>
      </form>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] p-5">
          <h2 className="text-base font-semibold text-espresso-600 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Order summary
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-cream-50">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest-600 text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-espresso-600 line-clamp-2 leading-snug">{item.name}</p>
                </div>
                <p className="text-xs font-bold text-espresso-600 shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-espresso-500">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-espresso-500">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? 'text-forest-600 font-semibold' : ''}>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
            </div>
          </div>
          <div className="border-t border-cream-200 pt-3 mt-2">
            <div className="flex justify-between font-bold text-espresso-600">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
