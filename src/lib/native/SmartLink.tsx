'use client'

import { openExternal } from './bridge'
import { cn } from '@/lib/utils/cn'
import type { AnchorHTMLAttributes } from 'react'

interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

const EXTERNAL_PROTOCOLS = ['https://wa.me', 'https://api.whatsapp.com', 'tel:', 'mailto:']

function isExternalUrl(href: string): boolean {
  if (EXTERNAL_PROTOCOLS.some((p) => href.startsWith(p))) return true
  try {
    const url = new URL(href, window.location.href)
    return url.hostname !== window.location.hostname
  } catch {
    return false
  }
}

export function SmartLink({ href, className, children, onClick, ...rest }: SmartLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isExternalUrl(href)) {
      e.preventDefault()
      openExternal(href)
    }
    onClick?.(e)
  }

  return (
    <a href={href} onClick={handleClick} className={cn(className)} {...rest}>
      {children}
    </a>
  )
}
