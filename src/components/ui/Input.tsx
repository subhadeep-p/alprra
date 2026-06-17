import { cn } from '@/lib/utils/cn'
import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-espresso-600">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-espresso-600 placeholder:text-espresso-300',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:border-forest-600',
            error && 'border-red-400 focus-visible:ring-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-espresso-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
