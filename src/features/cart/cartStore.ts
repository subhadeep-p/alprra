import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/models/product'

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  quantity: number
  /** Category slug. No longer used for pricing (packaging is box-based now), kept for display/analytics. */
  category: string
  /** Per-product minimum order quantity, if the admin configured one. */
  minOrderQuantity?: number
  /** How many units fit in one packaging box, used to compute the packaging fee at checkout. */
  itemsPerBox?: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          // First time this product is added — never add fewer than the
          // product's configured minimum order quantity.
          const seededQuantity = Math.max(quantity, product.minOrderQuantity ?? 1)
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: seededQuantity,
                category: product.category,
                minOrderQuantity: product.minOrderQuantity,
                itemsPerBox: product.itemsPerBox,
              },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'alprra-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
