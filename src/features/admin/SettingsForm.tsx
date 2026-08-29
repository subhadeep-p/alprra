'use client'

import { useState } from 'react'
import type { SiteSettings } from '@/lib/db/settings.repo'

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-espresso-600 placeholder:text-espresso-300 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100'

interface SettingsFormProps {
  initial: SiteSettings
  action: (formData: FormData) => Promise<void>
  error?: string
  saved?: boolean
}

export function SettingsForm({ initial, action, error, saved }: SettingsFormProps) {
  const [subject, setSubject] = useState(initial.orderCompletionEmailSubject)
  const [body, setBody] = useState(initial.orderCompletionEmailBody)

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-lg bg-terracotta-50 border border-terracotta-200 px-4 py-3 text-sm text-terracotta-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-lg bg-forest-50 border border-forest-200 px-4 py-3 text-sm text-forest-700">
          Settings saved.
        </div>
      )}

      <form action={action} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-espresso-600 mb-1">Order completion email</h2>
          <p className="text-xs text-espresso-400">
            Sent automatically to the customer when an order is marked <strong>Completed</strong> in{' '}
            <span className="font-mono">/admin/orders</span>. Use{' '}
            <code className="rounded bg-cream-100 px-1 py-0.5">{'{{name}}'}</code> and{' '}
            <code className="rounded bg-cream-100 px-1 py-0.5">{'{{orderNumber}}'}</code> as placeholders — paste
            your review link directly into the body below.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-500 mb-1.5 uppercase tracking-wide">
            Subject
          </label>
          <input
            name="orderCompletionEmailSubject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputCls}
            placeholder="Your Alprra order {{orderNumber}} is complete!"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-espresso-500 mb-1.5 uppercase tracking-wide">
            Body
          </label>
          <textarea
            name="orderCompletionEmailBody"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className={inputCls}
            placeholder="Hi {{name}}, your order {{orderNumber}} is complete..."
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
        >
          Save settings
        </button>
      </form>
    </div>
  )
}
