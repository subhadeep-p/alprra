// Thin wrapper around Resend, extracted from the original inline order-notification
// logic so both the internal order email and the customer-facing completion email
// share one sending path. Lazily imports `resend` and no-ops (logs) when
// RESEND_API_KEY isn't configured, matching the previous behavior.

export const EMAIL_FROM = 'orders@alprra.com'

export interface SendEmailInput {
  to: string
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[EMAIL]', { to, subject, text })
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  await resend.emails.send({ from: EMAIL_FROM, to, subject, text })
}
