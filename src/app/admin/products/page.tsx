import Link from 'next/link'
import { Plus, Pencil, Package } from 'lucide-react'
import { dbGetAllProducts } from '@/lib/db/products.repo'
import { DeleteProductButton } from '@/features/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const products = await dbGetAllProducts()

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-espresso-600">Products</h1>
          <p className="text-sm text-espresso-400 mt-1">{products.length} products in your catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Package className="h-10 w-10 text-espresso-300 mx-auto mb-3" />
          <p className="text-espresso-500 font-medium mb-1">No products yet</p>
          <p className="text-sm text-espresso-400 mb-4">
            Add your first product or run <code className="bg-cream-100 px-1.5 py-0.5 rounded text-xs">npm run db:seed</code> to import existing data.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-espresso-400 uppercase tracking-wider">Flags</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-espresso-600">{product.name}</p>
                    <p className="text-xs text-espresso-400 mt-0.5 truncate max-w-xs">{product.shortDescription}</p>
                  </td>
                  <td className="px-5 py-4 text-espresso-500 capitalize">{product.category}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-espresso-600">₹{product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-espresso-300 line-through ml-2">₹{product.compareAtPrice}</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                      product.availability === 'in_stock'
                        ? 'bg-forest-100 text-forest-700'
                        : product.availability === 'out_of_stock'
                        ? 'bg-terracotta-100 text-terracotta-700'
                        : 'bg-honey-100 text-honey-700'
                    }`}>
                      {product.availability.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {product.isFeatured && (
                        <span className="inline-block rounded-full bg-forest-50 text-forest-700 text-[10px] font-semibold px-2 py-0.5">Featured</span>
                      )}
                      {product.isBestseller && (
                        <span className="inline-block rounded-full bg-honey-50 text-honey-700 text-[10px] font-semibold px-2 py-0.5">Bestseller</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-espresso-600 hover:bg-gray-50 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
