import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Order Confirmed!',
  noIndex: true,
})

export default function CheckoutSuccessPage() {
  return (
    <div className="container-brand py-20 text-center">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-forest-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-forest-600" />
          </div>
        </div>
        <h1
          className="text-3xl font-semibold text-espresso-600 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Order confirmed!
        </h1>
        <p className="text-espresso-400 mb-4">
          Thank you for your order. Your WhatsApp message has been sent to our team.
          We will confirm your order and delivery slot within minutes.
        </p>
        <div className="bg-forest-50 border border-forest-100 rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-forest-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-espresso-600">What happens next?</p>
              <ol className="mt-2 space-y-1.5 text-sm text-espresso-500 list-decimal list-inside">
                <li>Our team receives your WhatsApp order</li>
                <li>We confirm availability and share your delivery slot</li>
                <li>Fresh products are packed and dispatched</li>
                <li>Payment is collected on delivery (COD)</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
