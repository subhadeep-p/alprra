import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
}

const sizeMap = {
  sm: { height: 32, width: 59 },
  md: { height: 44, width: 81 },
  lg: { height: 56, width: 103 },
}

export function Logo({ className, size = 'md', onDark = false }: LogoProps) {
  const { height, width } = sizeMap[size]

  return (
    <Link href="/" className={cn('flex items-center no-underline shrink-0', className)} aria-label="Alprra — Home">
      <span
        className={cn(
          'flex items-center justify-center rounded-xl overflow-hidden',
          onDark && 'bg-cream-50 px-2 py-1'
        )}
      >
        <Image
          src="/images/logo.png"
          alt="Alprra"
          height={height}
          width={width}
          className="object-contain"
          priority
          unoptimized
        />
      </span>
    </Link>
  )
}
