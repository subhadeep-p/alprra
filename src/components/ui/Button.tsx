import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/cn'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-forest-600 text-white hover:bg-forest-700 active:scale-95 focus-visible:ring-forest-600',
        secondary:
          'bg-cream-100 text-espresso-600 border border-cream-200 hover:bg-cream-200 active:scale-95 focus-visible:ring-forest-600',
        outline:
          'border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white active:scale-95 focus-visible:ring-forest-600',
        ghost:
          'text-espresso-600 hover:bg-cream-100 active:scale-95 focus-visible:ring-forest-600',
        accent:
          'bg-honey-400 text-espresso-700 hover:bg-honey-500 active:scale-95 focus-visible:ring-honey-400 shadow-[0_4px_16px_rgba(255,184,0,0.35)]',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:scale-95 focus-visible:ring-red-600',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={!asChild ? (disabled || loading) : undefined}
        {...props}
      >{asChild ? children : (<>{loading && (<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z" /></svg>)}{children}</>)}</Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
