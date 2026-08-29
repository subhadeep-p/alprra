import { getSiteSettings } from '@/lib/db/settings.repo'
import { saveSettingsAction } from './actions'
import { SettingsForm } from '@/features/admin/SettingsForm'

interface Props {
  searchParams: Promise<{ error?: string; saved?: string }>
}

export default async function AdminSettingsPage({ searchParams }: Props) {
  const { error, saved } = await searchParams
  const settings = await getSiteSettings()

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-espresso-600">Settings</h1>
        <p className="text-sm text-espresso-400 mt-1">Configure site-wide content, like automated customer emails.</p>
      </div>

      <SettingsForm initial={settings} action={saveSettingsAction} error={error} saved={saved === '1'} />
    </div>
  )
}
