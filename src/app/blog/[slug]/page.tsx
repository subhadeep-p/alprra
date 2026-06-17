import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getPostBySlug, getAllPostSlugs, getAllPosts } from '@/lib/blog'
import { buildBreadcrumbSchema } from '@/lib/schema/product'
import { JsonLd } from '@/components/seo/JsonLd'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/format'
import { siteConfig } from '@/config/site'
import { ArrowLeft } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seoTitle ?? `${post.title} | ${siteConfig.name}`,
    description: post.seoDescription ?? post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.description,
      images: [{ url: post.image, alt: post.title }],
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${slug}` },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${siteConfig.url}${post.image}`,
    datePublished: post.date,
    author: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    publisher: { '@type': 'Organization', name: siteConfig.name, logo: { '@type': 'ImageObject', url: `${siteConfig.url}${siteConfig.og.image}` } },
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />

      <div className="container-brand py-8">
        <nav className="text-sm text-espresso-400 mb-8">
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-forest-600 transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </nav>

        <article className="max-w-3xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default">{post.category}</Badge>
              {post.readingTime && <span className="text-xs text-espresso-400">{post.readingTime} min read</span>}
            </div>
            <h1
              className="text-3xl md:text-4xl font-semibold text-espresso-600 mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>
            <p className="text-lg text-espresso-400 leading-relaxed mb-6">{post.description}</p>
            <div className="flex items-center gap-3 text-sm text-espresso-400">
              <span>By {post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </header>

          {/* Hero image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-cream-100 mb-10">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>

          {/* MDX content */}
          <div className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-espresso-600
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-espresso-500 prose-p:leading-relaxed
            prose-a:text-forest-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-espresso-600
            prose-ul:text-espresso-500 prose-li:leading-relaxed
            prose-blockquote:border-forest-600 prose-blockquote:text-espresso-400
            prose-code:text-forest-700 prose-code:bg-forest-50 prose-code:rounded prose-code:px-1
          ">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                },
              }}
            />
          </div>

          {/* Tags */}
          <div className="mt-10 pt-8 border-t border-cream-200 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="cream">{tag}</Badge>
            ))}
          </div>
        </article>

        {/* Related posts */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold text-espresso-600 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            More from our blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {getAllPosts().filter((p) => p.slug !== slug).slice(0, 2).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-4 bg-white rounded-2xl border border-cream-200 p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-cream-100">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-espresso-600 group-hover:text-forest-600 line-clamp-2 leading-snug transition-colors">{p.title}</p>
                  <p className="text-xs text-espresso-400 mt-1">{formatDate(p.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
