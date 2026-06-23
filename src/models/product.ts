import { z } from 'zod'

export const HealthTagSchema = z.enum([
  'High Fiber',
  'No Refined Sugar',
  'No Added Sugar',
  'Protein Rich',
  'Gluten Conscious',
  'Vegan',
  'Keto Friendly',
  'Low Calorie',
  'No Preservatives',
  'No Palm Oil',
  'Whole Grain',
  'Natural Sweetener',
  'Kid Friendly',
  'Diabetic Friendly',
  'Air Fried',
  'Oil Conscious',
  'Grain Free',
  'Yeast Free',
  'Healthy Fats',
  '100% Oats Flour',
])

export const NutritionSchema = z.object({
  servingSize: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  sugar: z.number(),
  fiber: z.number(),
  fat: z.number(),
  sodium: z.number().optional(),
})

export const IngredientSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  benefit: z.string().optional(),
})

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  currency: z.string().default('INR'),
  image: z.string(),
  gallery: z.array(z.string()),
  category: z.string(),
  tags: z.array(z.string()),
  healthTags: z.array(HealthTagSchema),
  ingredients: z.array(IngredientSchema),
  benefits: z.array(z.string()),
  nutrition: NutritionSchema,
  allergens: z.array(z.string()),
  storageInstructions: z.string(),
  weight: z.string(),
  sku: z.string(),
  availability: z.enum(['in_stock', 'out_of_stock', 'pre_order']).default('in_stock'),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().optional(),
  faq: z.array(FAQItemSchema),
  seoTitle: z.string(),
  seoDescription: z.string(),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  whyTheseIngredients: z.string().optional(),
})

export const CategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
})

export type Product = z.infer<typeof ProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type HealthTag = z.infer<typeof HealthTagSchema>
export type Nutrition = z.infer<typeof NutritionSchema>
export type Ingredient = z.infer<typeof IngredientSchema>
export type FAQItem = z.infer<typeof FAQItemSchema>
