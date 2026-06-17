'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantityStepper({ value, onChange, min = 1, max = 20, className }: QuantityStepperProps) {
  return (
    <div className={cn('flex items-center gap-0 rounded-full border border-cream-200 bg-white overflow-hidden', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center text-espresso-500 hover:text-forest-600 hover:bg-cream-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-espresso-600" aria-live="polite" aria-label={`Quantity: ${value}`}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center text-espresso-500 hover:text-forest-600 hover:bg-cream-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
