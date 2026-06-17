import { siteConfig } from '@/config/site'
import type { Product } from '@/models/product'

export function buildProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteConfig.url}/products/${product.slug}`,
    name: product.name,
    description: product.description,
    image: [`${siteConfig.url}${product.image}`, ...product.gallery.map((g) => `${siteConfig.url}${g}`)],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    manufacturer: {
      '@id': `${siteConfig.url}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : product.availability === 'pre_order'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: {
        '@id': `${siteConfig.url}/#organization`,
      },
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    additionalProperty: [
      ...product.healthTags.map((tag) => ({
        '@type': 'PropertyValue',
        name: 'Health Feature',
        value: tag,
      })),
      ...product.allergens.map((allergen) => ({
        '@type': 'PropertyValue',
        name: 'Allergen',
        value: allergen,
      })),
      {
        '@type': 'PropertyValue',
        name: 'Net Weight',
        value: product.weight,
      },
    ],
    nutrition: {
      '@type': 'NutritionInformation',
      servingSize: product.nutrition.servingSize,
      calories: `${product.nutrition.calories} calories`,
      proteinContent: `${product.nutrition.protein}g`,
      carbohydrateContent: `${product.nutrition.carbs}g`,
      sugarContent: `${product.nutrition.sugar}g`,
      fiberContent: `${product.nutrition.fiber}g`,
      fatContent: `${product.nutrition.fat}g`,
    },
  }
}

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  }
}
