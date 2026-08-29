import { db } from './client'
import { siteSettings } from './schema'
import { eq } from 'drizzle-orm'

const SETTINGS_ID = 'default'

export interface SiteSettings {
  orderCompletionEmailSubject: string
  orderCompletionEmailBody: string
}

/** Sensible defaults shown the first time an admin opens the settings page, before anything's been saved. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  orderCompletionEmailSubject: 'Your Alprra order {{orderNumber}} is complete!',
  orderCompletionEmailBody: `Hi {{name}},

Great news — your order {{orderNumber}} has been completed. We hope you enjoy your snacks!

We'd love to hear what you thought. Please take a moment to leave us a review:
[paste your review link here]

Thank you for shopping with Alprra!`,
}

/** Reads the singleton settings row, falling back to defaults if it hasn't been saved yet. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, SETTINGS_ID)).limit(1)
  if (!row) return DEFAULT_SITE_SETTINGS

  return {
    orderCompletionEmailSubject: row.orderCompletionEmailSubject || DEFAULT_SITE_SETTINGS.orderCompletionEmailSubject,
    orderCompletionEmailBody: row.orderCompletionEmailBody || DEFAULT_SITE_SETTINGS.orderCompletionEmailBody,
  }
}

export async function upsertSiteSettings(values: SiteSettings): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ id: SETTINGS_ID, ...values, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { ...values, updatedAt: new Date() },
    })
}
