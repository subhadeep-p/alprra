import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  jsonb,
  uuid,
  timestamp,
  uniqueIndex,
  index,
  check,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// ===========================================================================
// MONEY: all monetary amounts are stored as INTEGER PAISE (minor units).
// e.g. ₹210.00 -> 21000. Never use floating point for money.
// Conversion to/from rupees happens at the repo / API boundary.
// ===========================================================================

// ---------------------------------------------------------------------------
// categories
// ---------------------------------------------------------------------------
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    image: text('image').notNull().default(''),
    seoTitle: text('seo_title').notNull().default(''),
    seoDescription: text('seo_description').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('categories_sort_order_idx').on(t.sortOrder)],
)

export type CategoryRow = typeof categories.$inferSelect
export type NewCategoryRow = typeof categories.$inferInsert

// ---------------------------------------------------------------------------
// products
// ---------------------------------------------------------------------------
// Core queryable fields are real columns; rich nested data lives in `attributes`
// (gallery, tags, healthTags, ingredients, benefits, nutrition, allergens,
// storageInstructions, weight, sku, faq, seo fields, whyTheseIngredients,
// and any custom fields the admin adds later).
// `id` is a stable surrogate UUID; `slug` is the mutable, human-facing handle.
// ---------------------------------------------------------------------------
export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    shortDescription: text('short_description').notNull().default(''),
    description: text('description').notNull().default(''),
    // money in paise
    price: integer('price').notNull(),
    compareAtPrice: integer('compare_at_price'),
    currency: text('currency').notNull().default('INR'),
    image: text('image').notNull().default(''),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    availability: text('availability').notNull().default('in_stock'),
    rating: real('rating'),
    reviewCount: integer('review_count'),
    isFeatured: boolean('is_featured').notNull().default(false),
    isBestseller: boolean('is_bestseller').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    // All rich/nested/extensible data
    attributes: jsonb('attributes').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('products_category_idx').on(t.categoryId),
    index('products_sort_order_idx').on(t.sortOrder),
    index('products_featured_idx').on(t.isFeatured).where(sql`${t.isFeatured} = true`),
    index('products_bestseller_idx').on(t.isBestseller).where(sql`${t.isBestseller} = true`),
    index('products_attributes_gin').using('gin', t.attributes),
    check(
      'products_availability_check',
      sql`${t.availability} in ('in_stock', 'out_of_stock', 'pre_order')`,
    ),
  ],
)

export type ProductRow = typeof products.$inferSelect
export type NewProductRow = typeof products.$inferInsert

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
// Guest-first identity. Phone is the primary identifier for logged-out
// customers, but BOTH phone and email are nullable + unique-when-present so a
// future social login (which may provide only email) can also be represented.
// `auth_user_id` links 1:1 to a future Supabase Auth user (auth.users); the
// cross-schema FK is added in the migration SQL (Drizzle can't express it).
// ---------------------------------------------------------------------------
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    phone: text('phone'),
    name: text('name').notNull().default(''),
    email: text('email'),
    defaultAddress: jsonb('default_address'),
    authUserId: uuid('auth_user_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('users_phone_unique').on(t.phone).where(sql`${t.phone} is not null`),
    uniqueIndex('users_email_unique').on(t.email).where(sql`${t.email} is not null`),
    uniqueIndex('users_auth_user_id_unique').on(t.authUserId).where(sql`${t.authUserId} is not null`),
  ],
)

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert

// ---------------------------------------------------------------------------
// orders
// ---------------------------------------------------------------------------
// `id` is a server-owned UUID; `order_number` is the human-facing ALP-... value
// generated server-side. `customer` is a JSONB snapshot so the order record is
// self-contained even if the user's profile changes later. Money in paise.
// ---------------------------------------------------------------------------
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderNumber: text('order_number').notNull().unique(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    customer: jsonb('customer').notNull(),
    items: jsonb('items').notNull(),
    // money in paise
    subtotal: integer('subtotal').notNull().default(0),
    deliveryFee: integer('delivery_fee').notNull().default(0),
    discount: integer('discount').notNull().default(0),
    total: integer('total').notNull(),
    currency: text('currency').notNull().default('INR'),
    status: text('status').notNull().default('pending'),
    paymentMethod: text('payment_method').notNull().default('cod'),
    paymentStatus: text('payment_status').notNull().default('unpaid'),
    outOfZone: boolean('out_of_zone').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('orders_user_idx').on(t.userId),
    index('orders_status_idx').on(t.status),
    index('orders_created_at_idx').on(t.createdAt),
    check(
      'orders_status_check',
      sql`${t.status} in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')`,
    ),
    check(
      'orders_payment_status_check',
      sql`${t.paymentStatus} in ('unpaid', 'paid', 'refunded')`,
    ),
  ],
)

export type OrderRow = typeof orders.$inferSelect
export type NewOrderRow = typeof orders.$inferInsert

// ---------------------------------------------------------------------------
// newsletter_subscribers
// ---------------------------------------------------------------------------
// Email captures from the storefront footer. Deduped by email (unique). Kept
// simple; can later be synced to an email marketing provider.
// ---------------------------------------------------------------------------
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  source: text('source').notNull().default('footer'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type NewsletterSubscriberRow = typeof newsletterSubscribers.$inferSelect
export type NewNewsletterSubscriberRow = typeof newsletterSubscribers.$inferInsert

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}))

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}))
