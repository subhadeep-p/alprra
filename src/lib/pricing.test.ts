import { describe, it, expect } from 'vitest'
import {
  computePackagingFee,
  computeTotals,
  DELIVERY_FEE,
  ORIGINAL_DELIVERY_FEE,
  PACKAGING_BASE_FEE,
} from './pricing'

describe('computePackagingFee', () => {
  it('charges only the base fee for an empty cart', () => {
    expect(computePackagingFee([])).toBe(PACKAGING_BASE_FEE)
  })

  it('charges only the base fee at or below the item threshold (2 items)', () => {
    expect(computePackagingFee([{ category: 'cookies', quantity: 2 }])).toBe(30)
    expect(
      computePackagingFee([
        { category: 'cookies', quantity: 1 },
        { category: 'energy-bars', quantity: 1 },
      ])
    ).toBe(30)
  })

  it('keeps a single-category cart at the base fee no matter the quantity (base covers the first category)', () => {
    // 3 units, 1 category -> 30 (base already covers the first category)
    expect(computePackagingFee([{ category: 'cookies', quantity: 3 }])).toBe(30)
    expect(computePackagingFee([{ category: 'cookies', quantity: 10 }])).toBe(30)
  })

  it('adds ₹10 per ADDITIONAL distinct category once the cart has more than 2 items', () => {
    // e.g. 2 muffins (breads-cakes) + 1 cookie (cookies) = 3 items, 2 categories -> 30 + 10*(2-1)
    expect(
      computePackagingFee([
        { category: 'breads-cakes', quantity: 2 },
        { category: 'cookies', quantity: 1 },
      ])
    ).toBe(40)
    // 3 categories, >2 items -> 30 + 10*(3-1)
    expect(
      computePackagingFee([
        { category: 'breads-cakes', quantity: 1 },
        { category: 'cookies', quantity: 1 },
        { category: 'energy-bars', quantity: 1 },
      ])
    ).toBe(50)
  })

  it('counts categories, not line items — repeated categories only count once', () => {
    // 3 items across 2 lines, but both lines share the same category -> still base only
    expect(
      computePackagingFee([
        { category: 'cookies', quantity: 2 },
        { category: 'cookies', quantity: 1 },
      ])
    ).toBe(30)
  })

  it('treats a missing/empty category defensively as a single bucket', () => {
    expect(
      computePackagingFee([
        { category: '', quantity: 2 },
        { category: '', quantity: 1 },
      ])
    ).toBe(30)
  })
})

describe('computeTotals', () => {
  it('always reports delivery as free while remembering the original fee', () => {
    const totals = computeTotals([{ category: 'cookies', quantity: 1, price: 100 }])
    expect(totals.deliveryFee).toBe(DELIVERY_FEE)
    expect(totals.deliveryFee).toBe(0)
    expect(totals.deliveryOriginal).toBe(ORIGINAL_DELIVERY_FEE)
  })

  it('sums subtotal correctly and folds packaging into the total', () => {
    const totals = computeTotals([
      { category: 'breads-cakes', quantity: 2, price: 30 },
      { category: 'cookies', quantity: 1, price: 240 },
    ])
    expect(totals.subtotal).toBe(2 * 30 + 240)
    expect(totals.packagingFee).toBe(40) // 3 items, 2 categories -> 30 + 10*(2-1)
    expect(totals.total).toBe(totals.subtotal + totals.deliveryFee + totals.packagingFee)
  })

  it('returns the base packaging fee for an empty cart with zero subtotal', () => {
    const totals = computeTotals([])
    expect(totals.subtotal).toBe(0)
    expect(totals.packagingFee).toBe(PACKAGING_BASE_FEE)
    expect(totals.total).toBe(PACKAGING_BASE_FEE)
  })
})
