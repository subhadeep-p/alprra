import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium text-xs leading-none',
  {
    variants: {
      variant: {
        default: 'bg-forest-100 text-forest-700 px-2.5 py-1',
        primary: 'bg-forest-600 text-white px-2.5 py-1',
        honey: 'bg-honey-100 text-honey-600 px-2.5 py-1',
        terracotta: 'bg-terracotta-100 text-terracotta-600 px-2.5 py-1',
        cream: 'bg-cream-200 text-espresso-600 px-2.5 py-1',
        outline: 'border border-forest-300 text-forest-700 px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

import React from 'react'

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
