'use client'

import { usePathname } from 'next/navigation'

/**
 * Hides storefront chrome (Header/Footer) on the admin console routes.
 * The admin section renders its own layout (logo-only header when logged out,
 * sidebar once authenticated), so the public site nav must not appear there.
 */
export function HideOnAdminRoutes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
