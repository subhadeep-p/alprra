import { z } from 'zod'

export const BlogFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string().default('Alprra Team'),
  category: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featured: z.boolean().default(false),
  readingTime: z.number().optional(),
})

export const BlogPostSchema = BlogFrontmatterSchema.extend({
  slug: z.string(),
  content: z.string(),
})

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>
export type BlogPost = z.infer<typeof BlogPostSchema>
