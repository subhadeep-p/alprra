// Single source of truth for checkout/cart pricing math — delivery is always
// free (we show the waived ₹60 for the "you saved" UX), and a small
// packaging & handling fee replaces it: ₹30 minimum, plus ₹10 for every
// distinct product category once the cart holds more than 2 items.

export interface PricingLineItem {
  /** Optional so callers with partial data (e.g. older persisted orders) still compile. */
  category?: string
  quantity: number
}

/** The delivery fee we used to charge — shown struck through, never charged anymore. */
export const ORIGINAL_DELIVERY_FEE = 60

/** Delivery is free on every order now. */
export const DELIVERY_FEE = 0

export const PACKAGING_BASE_FEE = 30
export const PACKAGING_PER_CATEGORY_FEE = 10
/** Packaging surcharge only kicks in once the cart holds more than this many items. */
export const PACKAGING_ITEM_THRESHOLD = 2

/**
 * ₹30 minimum packaging & handling charge. If the cart holds more than
 * `PACKAGING_ITEM_THRESHOLD` items (by quantity), add ₹10 for every distinct
 * product category present in the cart.
 */
export function computePackagingFee(items: PricingLineItem[]): number {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  if (totalQuantity <= PACKAGING_ITEM_THRESHOLD) return PACKAGING_BASE_FEE

  const distinctCategories = new Set(
    items.map((item) => item.category || '__uncategorized__')
  ).size

  return PACKAGING_BASE_FEE + PACKAGING_PER_CATEGORY_FEE * distinctCategories
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
