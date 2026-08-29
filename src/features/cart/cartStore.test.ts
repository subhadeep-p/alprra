import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'
import type { Product } from '@/models/product'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    slug: 'test-product',
    name: 'Test Product',
    shortDescription: 'Short',
    description: 'Long',
    price: 100,
    currency: 'INR',
    image: '/image.png',
    gallery: [],
    category: 'cookies',
    tags: [],
    healthTags: [],
    ingredients: [],
    benefits: [],
    nutrition: { servingSize: '', calories: 0, protein: 0, carbs: 0, sugar: 0, fiber: 0, fat: 0 },
    allergens: [],
    storageInstructions: '',
    weight: '100g',
    sku: 'SKU-1',
    availability: 'in_stock',
    faq: [],
    seoTitle: '',
    seoDescription: '',
    isFeatured: false,
    isBestseller: false,
    ...overrides,
  }
}

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('adds a new item at the requested quantity when the product has no minimum', () => {
    useCartStore.getState().addItem(makeProduct(), 1)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('seeds a new line item to at least the minimum order quantity', () => {
    const product = makeProduct({ id: 'prod-moq', minOrderQuantity: 3 })
    useCartStore.getState().addItem(product, 1)
    const item = useCartStore.getState().items.find((i) => i.productId === 'prod-moq')
    expect(item?.quantity).toBe(3)
  })

  it('does not clamp down a requested quantity already above the minimum', () => {
    const product = makeProduct({ id: 'prod-moq-2', minOrderQuantity: 3 })
    useCartStore.getState().addItem(product, 5)
    const item = useCartStore.getState().items.find((i) => i.productId === 'prod-moq-2')
    expect(item?.quantity).toBe(5)
  })

  it('carries category and minOrderQuantity onto the cart line', () => {
    const product = makeProduct({ id: 'prod-cat', category: 'energy-bars', minOrderQuantity: 2 })
    useCartStore.getState().addItem(product, 2)
    const item = useCartStore.getState().items.find((i) => i.productId === 'prod-cat')
    expect(item?.category).toBe('energy-bars')
    expect(item?.minOrderQuantity).toBe(2)
  })

  it('increments quantity per-click on an existing line, ignoring the minimum', () => {
    const product = makeProduct({ id: 'prod-inc', minOrderQuantity: 3 })
    useCartStore.getState().addItem(product, 1) // seeds to 3
    useCartStore.getState().addItem(product, 1) // existing line -> +1
    const item = useCartStore.getState().items.find((i) => i.productId === 'prod-inc')
    expect(item?.quantity).toBe(4)
  })

  it('computes subtotal and itemCount across multiple lines', () => {
    useCartStore.getState().addItem(makeProduct({ id: 'a', price: 50 }), 2)
    useCartStore.getState().addItem(makeProduct({ id: 'b', price: 30 }), 1)
    expect(useCartStore.getState().subtotal()).toBe(50 * 2 + 30 * 1)
    expect(useCartStore.getState().itemCount()).toBe(3)
  })

  it('removes an item when quantity is updated below 1', () => {
    useCartStore.getState().addItem(makeProduct({ id: 'c' }), 1)
    useCartStore.getState().updateQuantity('c', 0)
    expect(useCartStore.getState().items.find((i) => i.productId === 'c')).toBeUndefined()
  })
})
