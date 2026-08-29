'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { upsertSiteSettings } from '@/lib/db/settings.repo'

export async function saveSettingsAction(formData: FormData) {
  const orderCompletionEmailSubject = String(formData.get('orderCompletionEmailSubject') ?? '').trim()
  const orderCompletionEmailBody = String(formData.get('orderCompletionEmailBody') ?? '').trim()

  if (!orderCompletionEmailSubject || !orderCompletionEmailBody) {
    redirect('/admin/settings?error=' + encodeURIComponent('Subject and body are both required.'))
  }

  await upsertSiteSettings({ orderCompletionEmailSubject, orderCompletionEmailBody })

  revalidatePath('/admin/settings')
  redirect('/admin/settings?saved=1')
}
