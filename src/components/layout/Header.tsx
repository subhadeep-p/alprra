'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, Search } from 'lucide-react'
import { Logo } from './Logo'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils/cn'
import { useCartStore } from '@/features/cart/cartStore'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-250',
          scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-cream-200 shadow-[0_1px_8px_rgba(45,80,22,0.06)]'
            : 'bg-cream-50 border-b border-cream-200'
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="container-brand flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {siteConfig.nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-espresso-500 hover:text-forest-600 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-cream-100 transition-colors text-espresso-500 hover:text-forest-600"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-cream-100 transition-colors text-espresso-500 hover:text-forest-600"
              aria-label={`Cart — ${itemCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest-600 text-[10px] font-bold text-white leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
            >
              Shop Now
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden items-center justify-center h-10 w-10 rounded-full hover:bg-cream-100 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-espresso-900/20 backdrop-blur-sm" />
          <nav
            className="absolute top-16 left-0 right-0 bg-white border-b border-cream-200 shadow-xl px-5 py-6 flex flex-col gap-1"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            {siteConfig.nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center h-12 px-2 text-base font-medium text-espresso-600 hover:text-forest-600 hover:bg-cream-50 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-cream-100">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-12 rounded-full bg-forest-600 text-white font-semibold hover:bg-forest-700 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
