// Single source of truth for checkout/cart pricing math — delivery is always
// free (we show the waived ₹60 for the "you saved" UX), and a small
// packaging & handling fee replaces it: ₹30 minimum (which already covers the
// first packaging box), plus ₹10 for every *additional* box. A product's box
// count is ceil(quantity ÷ itemsPerBox) — items that ship loosely (itemsPerBox
// unset or 1) need one box per unit, while items that pack multiple units per
// box (e.g. muffins, itemsPerBox: 6) only need one box for a whole batch.

export interface PricingLineItem {
  quantity: number
  /** How many units fit in one packaging box. Defaults to 1 (each unit its own box) when unset. */
  itemsPerBox?: number
}

/** The delivery fee we used to charge — shown struck through, never charged anymore. */
export const ORIGINAL_DELIVERY_FEE = 60

/** Delivery is free on every order now. */
export const DELIVERY_FEE = 0

export const PACKAGING_BASE_FEE = 30
export const PACKAGING_PER_BOX_FEE = 10

/** Boxes needed for a single line item: ceil(quantity ÷ itemsPerBox), itemsPerBox defaulting to 1. */
function boxesForLineItem(item: PricingLineItem): number {
  const itemsPerBox = Math.max(1, item.itemsPerBox ?? 1)
  return Math.ceil(item.quantity / itemsPerBox)
}

/**
 * ₹30 minimum packaging & handling charge — this base already covers the
 * first packaging box across the whole cart. Add ₹10 for every *additional*
 * box beyond the first. A cart that only ever fills one box (e.g. 5 muffins
 * with itemsPerBox: 6) therefore always stays at ₹30, no matter the quantity.
 */
export function computePackagingFee(items: PricingLineItem[]): number {
  const totalBoxes = items.reduce((sum, item) => sum + boxesForLineItem(item), 0)
  const extraBoxes = Math.max(0, totalBoxes - 1)

  return PACKAGING_BASE_FEE + PACKAGING_PER_BOX_FEE * extraBoxes
}

export interface OrderTotals {
  subtotal: number
  deliveryOriginal: number
  deliveryFee: number
  packagingFee: number
  total: number
}

export function computeTotals(items: Array<PricingLineItem & { price: number }>): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const packagingFee = computePackagingFee(items)

  return {
    subtotal,
    deliveryOriginal: ORIGINAL_DELIVERY_FEE,
    deliveryFee: DELIVERY_FEE,
    packagingFee,
    total: subtotal + DELIVERY_FEE + packagingFee,
  }
}
