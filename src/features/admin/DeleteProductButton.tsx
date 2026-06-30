'use client'

import { Trash2 } from 'lucide-react'
import { deleteProductAction } from '@/app/admin/products/actions'

interface Props {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: Props) {
  return (
    <button
      onClick={async () => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
        await deleteProductAction(id)
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-terracotta-200 px-3 py-1.5 text-xs font-medium text-terracotta-600 hover:bg-terracotta-50 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  )
}
