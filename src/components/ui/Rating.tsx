import { cn } from '@/lib/utils/cn'
import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  count?: number
  className?: string
}

export function Rating({ value, max = 5, size = 'md', showValue = false, count, className }: RatingProps) {
  const sizeMap = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' }
  const stars = Array.from({ length: max }, (_, i) => {
    const filled = i < Math.floor(value)
    const partial = !filled && i < value
    return { filled, partial, index: i }
  })

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {stars.map(({ filled, index }) => (
          <Star
            key={index}
            className={cn(
              sizeMap[size],
              filled ? 'fill-honey-400 text-honey-400' : 'fill-cream-200 text-cream-300'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-espresso-600">{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-sm text-espresso-400">({count.toLocaleString('en-IN')} reviews)</span>
      )}
    </div>
  )
}
