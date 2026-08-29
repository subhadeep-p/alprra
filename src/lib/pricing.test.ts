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

  it('charges only the base fee for a single loose unit (itemsPerBox defaults to 1)', () => {
    expect(computePackagingFee([{ quantity: 1 }])).toBe(30)
  })

  it('adds ₹10 per extra box for loose items (itemsPerBox 1) — one box per unit', () => {
    // 3 loose units -> 3 boxes -> 30 + 10*(3-1)
    expect(computePackagingFee([{ quantity: 3, itemsPerBox: 1 }])).toBe(50)
  })

  it('keeps the base fee when a whole batch fits in one box', () => {
    // 6 muffins, 6 per box -> 1 box -> base only
    expect(computePackagingFee([{ quantity: 6, itemsPerBox: 6 }])).toBe(30)
    // partial box still counts as a full box, but here quantity == capacity exactly
    expect(computePackagingFee([{ quantity: 1, itemsPerBox: 6 }])).toBe(30)
  })

  it('rounds up to an extra box once capacity is exceeded', () => {
    // 7 muffins, 6 per box -> ceil(7/6) = 2 boxes -> 30 + 10*(2-1)
    expect(computePackagingFee([{ quantity: 7, itemsPerBox: 6 }])).toBe(40)
  })

  it('sums boxes across multiple line items', () => {
    // 2 loose items (2 boxes) + 6 muffins at 6/box (1 box) = 3 boxes -> 30 + 10*(3-1)
    expect(
      computePackagingFee([
        { quantity: 2, itemsPerBox: 1 },
        { quantity: 6, itemsPerBox: 6 },
      ])
    ).toBe(50)
  })

  it('treats a missing itemsPerBox as 1 (one box per unit)', () => {
    expect(computePackagingFee([{ quantity: 3 }])).toBe(50)
  })
})

describe('computeTotals', () => {
  it('always reports delivery as free while remembering the original fee', () => {
    const totals = computeTotals([{ quantity: 1, price: 100 }])
    expect(totals.deliveryFee).toBe(DELIVERY_FEE)
    expect(totals.deliveryFee).toBe(0)
    expect(totals.deliveryOriginal).toBe(ORIGINAL_DELIVERY_FEE)
  })

  it('sums subtotal correctly and folds packaging into the total', () => {
    const totals = computeTotals([
      { quantity: 2, price: 30, itemsPerBox: 1 },
      { quantity: 1, price: 240, itemsPerBox: 1 },
    ])
    expect(totals.subtotal).toBe(2 * 30 + 240)
    expect(totals.packagingFee).toBe(50) // 3 loose units -> 3 boxes -> 30 + 10*(3-1)
    expect(totals.total).toBe(totals.subtotal + totals.deliveryFee + totals.packagingFee)
  })

  it('returns the base packaging fee for an empty cart with zero subtotal', () => {
    const totals = computeTotals([])
    expect(totals.subtotal).toBe(0)
    expect(totals.packagingFee).toBe(PACKAGING_BASE_FEE)
    expect(totals.total).toBe(PACKAGING_BASE_FEE)
  })
})
