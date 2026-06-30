import { notFound } from 'next/navigation'
import { rowToProduct, dbGetProductRowById, dbGetAllCategories } from '@/lib/db/products.repo'
import { ProductEditor } from '@/features/admin/ProductEditor'
import { saveProductAction } from '../actions'
import { uploadProductImageAction } from '../upload-action'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const { error } = await searchParams

  const [row, categories] = await Promise.all([dbGetProductRowById(id), dbGetAllCategories()])
  if (!row) notFound()

  const product = rowToProduct(row.product, row.categorySlug ?? '')

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-espresso-600">Edit product</h1>
        <p className="text-sm text-espresso-400 mt-1">{product.name}</p>
      </div>

      <ProductEditor
        initial={product}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        action={saveProductAction}
        uploadAction={uploadProductImageAction}
        submitLabel="Save changes"
        sortOrder={row.product.sortOrder}
        error={error}
      />
    </div>
  )
}
