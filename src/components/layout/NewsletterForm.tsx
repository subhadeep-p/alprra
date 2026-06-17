'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="text-sm text-forest-100">You are subscribed! Look out for our next post.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 md:w-64 rounded-full px-4 py-2.5 text-sm text-espresso-600 placeholder:text-espresso-300 bg-white focus:outline-none focus:ring-2 focus:ring-honey-400"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 rounded-full bg-honey-400 px-5 py-2.5 text-sm font-semibold text-espresso-700 hover:bg-honey-300 transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}
