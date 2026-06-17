import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <Link href="/" className={cn('flex items-center gap-2 no-underline', className)} aria-label="Alprra — Home">
      {/* Leaf mark */}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
          <path
            d="M12 3C7 3 3 7 3 12c0 4.5 3 8.5 7 9.5V12c0-3.3 2.7-6 6-6h2.5C18 4.5 15 3 12 3z"
            fill="currentColor"
          />
          <path d="M12 21.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className={cn(
          'font-display font-semibold text-espresso-600 tracking-tight',
          sizeMap[size]
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        alprra
      </span>
    </Link>
  )
}
