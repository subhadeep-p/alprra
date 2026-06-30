'use server'

import { uploadProductImage, MAX_IMAGE_BYTES } from '@/lib/storage/supabase'

export interface UploadResult {
  url?: string
  error?: string
}

/**
 * Admin-only image upload. Reachable only under /admin/* (guarded by middleware),
 * so the service-role upload runs behind the admin session. Returns the public
 * URL to store on the product, or an error message for the client to display.
 */
export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file')
  const slug = (formData.get('slug') as string) || ''

  if (!(file instanceof File)) {
    return { error: 'No file provided' }
  }
  if (file.size === 0) {
    return { error: 'File is empty' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: `File too large (max ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB)` }
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const url = await uploadProductImage({ data: bytes, contentType: file.type, slug })
    return { url }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed' }
  }
}
