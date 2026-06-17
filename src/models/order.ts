import { z } from 'zod'

export const CustomerDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(10, 'Please enter your full delivery address'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  notes: z.string().optional(),
})

export const OrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  image: z.string(),
})

export const OrderSchema = z.object({
  id: z.string(),
  customer: CustomerDetailsSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  total: z.number(),
  currency: z.string().default('INR'),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  createdAt: z.string(),
  notes: z.string().optional(),
})

export const CheckoutFormSchema = CustomerDetailsSchema

export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Order = z.infer<typeof OrderSchema>
export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>
