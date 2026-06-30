import { ProductEditor } from '@/features/admin/ProductEditor'
import { dbGetAllCategories } from '@/lib/db/products.repo'
import { saveProductAction } from '../actions'
import { uploadProductImageAction } from '../upload-action'

export default async function NewProductPage() {
  const categories = await dbGetAllCategories()

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-espresso-600">New product</h1>
        <p className="text-sm text-espresso-400 mt-1">Fill in the details below. The card preview updates as you type.</p>
      </div>

      <ProductEditor
        initial={{}}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        action={saveProductAction}
        uploadAction={uploadProductImageAction}
        submitLabel="Create product"
      />
    </div>
  )
}
