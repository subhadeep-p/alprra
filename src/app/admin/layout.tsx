import Link from 'next/link'
import { cookies } from 'next/headers'
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react'
import { logoutAction } from './login/actions'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session'
import { Logo } from '@/components/layout/Logo'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const authed = token ? await verifySessionToken(token) : false

  // Logged out (e.g. the login screen): brand-only header + centered content.
  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <header className="h-16 shrink-0 border-b border-cream-200 bg-cream-50">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-2.5 px-6">
            <Logo href="/admin" size="sm" />
            <span className="rounded-md bg-cream-100 px-1.5 py-0.5 text-[11px] font-medium text-espresso-400">
              Admin
            </span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Logo href="/admin" size="sm" />
            <span className="rounded-md bg-cream-100 px-1.5 py-0.5 text-[11px] font-medium text-espresso-400">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-espresso-500 hover:bg-cream-50 hover:text-espresso-700 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-espresso-400 hover:bg-cream-50 hover:text-espresso-700 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
