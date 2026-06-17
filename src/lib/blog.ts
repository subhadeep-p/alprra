import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost } from '@/models/blog'
import { BlogFrontmatterSchema } from '@/models/blog'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200) // 200 wpm average
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      const frontmatter = BlogFrontmatterSchema.parse({
        ...data,
        readingTime: data.readingTime ?? calculateReadingTime(content),
      })
      return { ...frontmatter, slug, content }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = BlogFrontmatterSchema.parse({
    ...data,
    readingTime: data.readingTime ?? calculateReadingTime(content),
  })
  return { ...frontmatter, slug, content }
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .slice(0, limit)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}
