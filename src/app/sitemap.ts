import type { MetadataRoute } from 'next'
import { getAllProductSlugs, getAllCategorySlugs } from '@/lib/products'
import { getAllPostSlugs } from '@/lib/blog'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const productPages: MetadataRoute.Sitemap = getAllProductSlugs().map((slug) => ({
    url: `${base}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const categoryPages: MetadataRoute.Sitemap = getAllCategorySlugs().map((slug) => ({
    url: `${base}/products/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  const blogPages: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages]
}
