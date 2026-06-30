import { loginAction } from './actions'
import { Logo } from '@/components/layout/Logo'

interface Props {
  searchParams: Promise<{ error?: string; from?: string }>
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, from } = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo href="/admin" size="lg" />
          </div>
          <h1 className="text-2xl font-semibold text-espresso-600">Alprra Admin</h1>
          <p className="text-sm text-espresso-400 mt-1">Sign in to manage your store</p>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-terracotta-50 border border-terracotta-200 px-4 py-3 text-sm text-terracotta-700">
              Invalid username or password. Please try again.
            </div>
          )}

          <form action={loginAction}>
            <input type="hidden" name="from" value={from ?? '/admin'} />

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-espresso-600 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm text-espresso-600 placeholder:text-espresso-300 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-200"
                  placeholder="admin"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-espresso-600 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm text-espresso-600 placeholder:text-espresso-300 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-200"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
