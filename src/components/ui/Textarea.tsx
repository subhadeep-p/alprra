import { cn } from '@/lib/utils/cn'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-espresso-600 placeholder:text-espresso-300 resize-none',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:border-forest-600',
            error && 'border-red-400 focus-visible:ring-red-400',
            className
          )}
          rows={props.rows ?? 4}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-espresso-400">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
