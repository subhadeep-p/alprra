'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Eye, Upload, Loader2 } from 'lucide-react'
import type { Product, HealthTag } from '@/models/product'
import { ProductCard } from '@/features/products/ProductCard'

type UploadResult = { url?: string; error?: string }

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Ingredient = { name: string; description: string; benefit: string }
type FAQItem = { question: string; answer: string }
type CustomField = { key: string; value: string }

export interface ProductEditorProps {
  initial: Partial<Product> & { id?: string }
  action: (formData: FormData) => Promise<void>
  uploadAction: (formData: FormData) => Promise<UploadResult>
  categories: Array<{ slug: string; name: string }>
  submitLabel?: string
  sortOrder?: number
  error?: string
}

const ALL_HEALTH_TAGS: HealthTag[] = [
  'High Fiber', 'No Refined Sugar', 'No Added Sugar', 'Protein Rich',
  'Gluten Conscious', 'Vegan', 'Keto Friendly', 'Low Calorie',
  'No Preservatives', 'No Palm Oil', 'Whole Grain', 'Natural Sweetener',
  'Kid Friendly', 'Diabetic Friendly', 'Air Fried', 'Oil Conscious',
  'Grain Free', 'Yeast Free', 'Healthy Fats', '100% Oats Flour',
]

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'pre_order', label: 'Pre Order' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductEditor({ initial, action, uploadAction, categories, submitLabel = 'Save product', sortOrder = 0, error }: ProductEditorProps) {
  // Core fields
  const [id] = useState(initial.id ?? '')
  const [slug, setSlug] = useState(initial.slug ?? '')
  const [name, setName] = useState(initial.name ?? '')
  const [shortDescription, setShortDescription] = useState(initial.shortDescription ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [price, setPrice] = useState(String(initial.price ?? ''))
  const [compareAtPrice, setCompareAtPrice] = useState(String(initial.compareAtPrice ?? ''))
  const [currency] = useState(initial.currency ?? 'INR')
  const [image, setImage] = useState(initial.image ?? '')
  const [category, setCategory] = useState(initial.category ?? categories[0]?.slug ?? '')
  const [availability, setAvailability] = useState<Product['availability']>(initial.availability ?? 'in_stock')
  const [rating, setRating] = useState(String(initial.rating ?? ''))
  const [reviewCount, setReviewCount] = useState(String(initial.reviewCount ?? ''))
  const [isFeatured, setIsFeatured] = useState(initial.isFeatured ?? false)
  const [isBestseller, setIsBestseller] = useState(initial.isBestseller ?? false)

  // Rich fields
  const [gallery, setGallery] = useState<string[]>(initial.gallery ?? [])
  const [tags, setTags] = useState<string[]>(initial.tags ?? [])
  const [healthTags, setHealthTags] = useState<HealthTag[]>(initial.healthTags ?? [])
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    (initial.ingredients ?? []).map((i) => ({ name: i.name, description: i.description ?? '', benefit: i.benefit ?? '' }))
  )
  const [benefits, setBenefits] = useState<string[]>(initial.benefits ?? [])
  const [nutrition, setNutrition] = useState(initial.nutrition ?? {
    servingSize: '', calories: 0, protein: 0, carbs: 0, sugar: 0, fiber: 0, fat: 0, sodium: undefined as number | undefined,
  })
  const [allergens, setAllergens] = useState<string[]>(initial.allergens ?? [])
  const [storageInstructions, setStorageInstructions] = useState(initial.storageInstructions ?? '')
  const [weight, setWeight] = useState(initial.weight ?? '')
  const [sku, setSku] = useState(initial.sku ?? '')
  const [faq, setFaq] = useState<FAQItem[]>(initial.faq ?? [])
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription ?? '')
  const [whyTheseIngredients, setWhyTheseIngredients] = useState(initial.whyTheseIngredients ?? '')

  // Custom fields (key/value pairs stored in attributes.customFields)
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  // UI state
  const [activeTab, setActiveTab] = useState<'basic' | 'rich' | 'seo' | 'preview'>('basic')
  const [previewOpen, setPreviewOpen] = useState(false)

  // Auto-generate slug from name when creating new (id is server-owned UUID)
  const handleNameChange = useCallback((val: string) => {
    setName(val)
    if (!initial.id) {
      setSlug(slugify(val))
    }
  }, [initial.id])

  // Build current Product for preview
  const previewProduct: Product = {
    id: id || 'preview',
    slug: slug || 'preview',
    name: name || 'Product name',
    shortDescription,
    description,
    price: Number(price) || 0,
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
    currency,
    image,
    gallery,
    category,
    tags,
    healthTags,
    ingredients: ingredients.map((i) => ({ name: i.name, description: i.description || undefined, benefit: i.benefit || undefined })),
    benefits,
    nutrition,
    allergens,
    storageInstructions,
    weight,
    sku,
    availability: availability as Product['availability'],
    rating: rating ? Number(rating) : undefined,
    reviewCount: reviewCount ? Number(reviewCount) : undefined,
    faq,
    seoTitle,
    seoDescription,
    isFeatured,
    isBestseller,
    whyTheseIngredients: whyTheseIngredients || undefined,
  }

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'rich', label: 'Details' },
    { id: 'seo', label: 'SEO' },
    { id: 'preview', label: 'Preview', icon: Eye },
  ] as const

  return (
    <div className="flex gap-6 items-start">
      {/* Form */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-espresso-700 shadow-sm'
                  : 'text-espresso-400 hover:text-espresso-600'
              }`}
            >
              {'icon' in tab && tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-espresso-400 hover:text-espresso-600 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            {previewOpen ? 'Hide preview' : 'Show preview'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-terracotta-50 border border-terracotta-200 px-4 py-3 text-sm text-terracotta-700">
            {error}
          </div>
        )}

        <form action={action}>
          {/* Hidden serialized fields */}
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="currency" value={currency} />
          <input type="hidden" name="sortOrder" value={String(sortOrder)} />
          <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <input type="hidden" name="healthTags" value={JSON.stringify(healthTags)} />
          <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
          <input type="hidden" name="benefits" value={JSON.stringify(benefits)} />
          <input type="hidden" name="nutrition" value={JSON.stringify(nutrition)} />
          <input type="hidden" name="allergens" value={JSON.stringify(allergens)} />
          <input type="hidden" name="faq" value={JSON.stringify(faq)} />
          <input type="hidden" name="isFeatured" value={String(isFeatured)} />
          <input type="hidden" name="isBestseller" value={String(isBestseller)} />

          {/* ── BASIC TAB ──────────────────────────────────────────── */}
          <div className={activeTab === 'basic' ? '' : 'hidden'}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-espresso-600 mb-1">Core information</h2>

              <Field label="Product name" required>
                <input name="name" value={name} onChange={(e) => handleNameChange(e.target.value)}
                  className={inputCls} placeholder="e.g. Almond Oats Cookies" required />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="URL slug" required hint="Auto-generated from name. Changing this changes the product URL.">
                  <input name="___slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                    className={inputCls} placeholder="almond-oats-cookies" required />
                </Field>
                <Field label="SKU">
                  <input name="sku" value={sku} onChange={(e) => setSku(e.target.value)}
                    className={inputCls} placeholder="ALM-OAT-COK-200" />
                </Field>
              </div>

              <Field label="Short description" required>
                <textarea name="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
                  rows={2} className={inputCls + ' resize-none'} required />
              </Field>

              <Field label="Full description">
                <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={4} className={inputCls + ' resize-none'} />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (₹)" required>
                  <input name="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    className={inputCls} step="0.01" required />
                </Field>
                <Field label="Compare-at price (₹)">
                  <input name="compareAtPrice" type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)}
                    className={inputCls} step="0.01" />
                </Field>
                <Field label="Weight">
                  <input name="weight" value={weight} onChange={(e) => setWeight(e.target.value)}
                    className={inputCls} placeholder="200g" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Category" required>
                  <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}
                    className={inputCls} required>
                    {categories.length === 0 && <option value="">No categories — create one first</option>}
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Availability">
                  <select name="availability" value={availability} onChange={(e) => setAvailability(e.target.value as Product['availability'])}
                    className={inputCls}>
                    {AVAILABILITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Rating">
                  <input name="rating" type="number" value={rating} onChange={(e) => setRating(e.target.value)}
                    className={inputCls} step="0.1" min="0" max="5" placeholder="4.8" />
                </Field>
              </div>

              <Field label="Product image" hint="Upload a file (stored in Supabase Storage) or paste an existing URL.">
                <div className="flex items-start gap-4">
                  <ImagePreview src={image} onClear={() => setImage('')} />
                  <div className="flex-1 space-y-2">
                    <ImageUploadButton
                      slug={slug}
                      uploadAction={uploadAction}
                      onUploaded={(url) => setImage(url)}
                      label="Upload image"
                    />
                    <input name="image" value={image} onChange={(e) => setImage(e.target.value)}
                      className={inputCls} placeholder="https://… or /images/products/my-product.png" />
                  </div>
                </div>
              </Field>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500" />
                  <span className="text-espresso-600 font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500" />
                  <span className="text-espresso-600 font-medium">Bestseller</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── DETAILS TAB ────────────────────────────────────────── */}
          <div className={activeTab === 'rich' ? '' : 'hidden'}>
            <div className="space-y-6">
              {/* Health tags */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-espresso-600 mb-4">Health tags</h2>
                <div className="flex flex-wrap gap-2">
                  {ALL_HEALTH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setHealthTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                        healthTags.includes(tag)
                          ? 'bg-forest-600 text-white border-forest-600'
                          : 'bg-white text-espresso-500 border-gray-200 hover:border-forest-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-espresso-600">Ingredients</h2>
                  <button type="button" onClick={() => setIngredients((p) => [...p, { name: '', description: '', benefit: '' }])}
                    className={addBtnCls}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
                      <div className="flex gap-2">
                        <input value={ing.name} onChange={(e) => updateList(setIngredients, i, 'name', e.target.value)}
                          placeholder="Ingredient name" className={inputCls + ' flex-1'} />
                        <button type="button" onClick={() => setIngredients((p) => p.filter((_, j) => j !== i))}
                          className="text-terracotta-400 hover:text-terracotta-600 p-1"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <input value={ing.description} onChange={(e) => updateList(setIngredients, i, 'description', e.target.value)}
                        placeholder="Description (optional)" className={inputCls} />
                      <input value={ing.benefit} onChange={(e) => updateList(setIngredients, i, 'benefit', e.target.value)}
                        placeholder="Health benefit (optional)" className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <StringListEditor
                title="Health benefits"
                items={benefits}
                setItems={setBenefits}
                placeholder="e.g. Rich in antioxidants and aids digestion"
              />

              {/* Allergens */}
              <StringListEditor
                title="Allergens"
                items={allergens}
                setItems={setAllergens}
                placeholder="e.g. Tree Nuts (Almonds)"
              />

              {/* Gallery */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-espresso-600">Gallery images</h2>
                  <div className="flex items-center gap-2">
                    <ImageUploadButton
                      slug={slug}
                      uploadAction={uploadAction}
                      onUploaded={(url) => setGallery((p) => [...p, url])}
                      label="Upload"
                    />
                    <button type="button" onClick={() => setGallery((p) => [...p, ''])} className={addBtnCls}>
                      <Plus className="h-3.5 w-3.5" /> Add URL
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {gallery.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ImageThumb src={item} />
                      <input
                        value={item}
                        onChange={(e) => setGallery((p) => p.map((v, j) => (j === i ? e.target.value : v)))}
                        placeholder="https://… or /images/products/my-product-2.png"
                        className={inputCls + ' flex-1'}
                      />
                      <button type="button" onClick={() => setGallery((p) => p.filter((_, j) => j !== i))}
                        className="text-terracotta-400 hover:text-terracotta-600 p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {gallery.length === 0 && (
                    <p className="text-xs text-espresso-300 italic">None yet — upload a file or add a URL.</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <StringListEditor
                title="Tags"
                items={tags}
                setItems={setTags}
                placeholder="e.g. cookies"
              />

              {/* Nutrition */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-espresso-600 mb-4">Nutrition information</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Serving size">
                    <input value={nutrition.servingSize}
                      onChange={(e) => setNutrition((n) => ({ ...n, servingSize: e.target.value }))}
                      className={inputCls} placeholder="2 cookies (40g)" />
                  </Field>
                  {(['calories', 'protein', 'carbs', 'sugar', 'fiber', 'fat'] as const).map((key) => (
                    <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                      <input type="number" step="0.1" value={nutrition[key]}
                        onChange={(e) => setNutrition((n) => ({ ...n, [key]: Number(e.target.value) }))}
                        className={inputCls} />
                    </Field>
                  ))}
                  <Field label="Sodium (mg)">
                    <input type="number" step="1" value={nutrition.sodium ?? ''}
                      onChange={(e) => setNutrition((n) => ({ ...n, sodium: e.target.value ? Number(e.target.value) : undefined }))}
                      className={inputCls} placeholder="Optional" />
                  </Field>
                </div>
              </div>

              {/* Storage */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-espresso-600 mb-4">Storage & extra</h2>
                <div className="space-y-4">
                  <Field label="Storage instructions">
                    <textarea name="storageInstructions" value={storageInstructions}
                      onChange={(e) => setStorageInstructions(e.target.value)}
                      rows={2} className={inputCls + ' resize-none'} />
                  </Field>
                  <Field label="Why these ingredients?">
                    <textarea name="whyTheseIngredients" value={whyTheseIngredients}
                      onChange={(e) => setWhyTheseIngredients(e.target.value)}
                      rows={4} className={inputCls + ' resize-none'} />
                  </Field>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-espresso-600">FAQ</h2>
                  <button type="button" onClick={() => setFaq((p) => [...p, { question: '', answer: '' }])}
                    className={addBtnCls}>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {faq.map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
                      <div className="flex gap-2">
                        <input value={item.question} onChange={(e) => updateList(setFaq, i, 'question', e.target.value)}
                          placeholder="Question" className={inputCls + ' flex-1'} />
                        <button type="button" onClick={() => setFaq((p) => p.filter((_, j) => j !== i))}
                          className="text-terracotta-400 hover:text-terracotta-600 p-1"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <textarea value={item.answer} onChange={(e) => updateList(setFaq, i, 'answer', e.target.value)}
                        placeholder="Answer" rows={2} className={inputCls + ' resize-none'} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom fields */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-espresso-600">Custom fields</h2>
                    <p className="text-xs text-espresso-400 mt-0.5">Add any extra key/value data — no code change needed.</p>
                  </div>
                  <button type="button" onClick={() => setCustomFields((p) => [...p, { key: '', value: '' }])}
                    className={addBtnCls}>
                    <Plus className="h-3.5 w-3.5" /> Add field
                  </button>
                </div>
                <input type="hidden" name="customFields" value={JSON.stringify(Object.fromEntries(customFields.map((f) => [f.key, f.value])))} />
                <div className="space-y-2">
                  {customFields.map((cf, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={cf.key} onChange={(e) => updateList(setCustomFields, i, 'key', e.target.value)}
                        placeholder="Field name" className={inputCls + ' flex-1'} />
                      <input value={cf.value} onChange={(e) => updateList(setCustomFields, i, 'value', e.target.value)}
                        placeholder="Value" className={inputCls + ' flex-1'} />
                      <button type="button" onClick={() => setCustomFields((p) => p.filter((_, j) => j !== i))}
                        className="text-terracotta-400 hover:text-terracotta-600 p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SEO TAB ────────────────────────────────────────────── */}
          <div className={activeTab === 'seo' ? '' : 'hidden'}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-espresso-600 mb-1">SEO & discoverability</h2>
              <Field label="SEO title" hint="~60 chars. Appears in browser tab and Google result title.">
                <input name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  className={inputCls} maxLength={80} />
                <p className="text-xs text-espresso-300 mt-1">{seoTitle.length} chars</p>
              </Field>
              <Field label="SEO description" hint="~155 chars. Appears below the title in Google results.">
                <textarea name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3} className={inputCls + ' resize-none'} maxLength={200} />
                <p className="text-xs text-espresso-300 mt-1">{seoDescription.length} chars</p>
              </Field>
            </div>
          </div>

          {/* ── PREVIEW TAB ────────────────────────────────────────── */}
          <div className={activeTab === 'preview' ? '' : 'hidden'}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-espresso-600 mb-4">Live card preview — updates as you type in other tabs</p>
              <div className="max-w-xs">
                <ProductCard product={previewProduct} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-forest-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2"
            >
              {submitLabel}
            </button>
            <Link href="/admin/products" className="text-sm text-espresso-400 hover:text-espresso-600 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Floating preview panel */}
      {previewOpen && (
        <div className="sticky top-8 w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-espresso-400 uppercase tracking-wider mb-3">Card preview</p>
            <ProductCard product={previewProduct} />
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-espresso-500 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-terracotta-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-espresso-300 mt-1">{hint}</p>}
    </div>
  )
}

function StringListEditor({ title, items, setItems, placeholder }: {
  title: string
  items: string[]
  setItems: React.Dispatch<React.SetStateAction<string[]>>
  placeholder?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-espresso-600">{title}</h2>
        <button type="button" onClick={() => setItems((p) => [...p, ''])} className={addBtnCls}>
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => setItems((p) => p.map((v, j) => j === i ? e.target.value : v))}
              placeholder={placeholder}
              className={inputCls + ' flex-1'}
            />
            <button type="button" onClick={() => setItems((p) => p.filter((_, j) => j !== i))}
              className="text-terracotta-400 hover:text-terracotta-600 p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-espresso-300 italic">None yet — click Add to get started.</p>
        )}
      </div>
    </div>
  )
}

// Uploads a single image file via the server action and reports back the URL.
function ImageUploadButton({ slug, uploadAction, onUploaded, label = 'Upload image' }: {
  slug: string
  uploadAction: (formData: FormData) => Promise<UploadResult>
  onUploaded: (url: string) => void
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('slug', slug)
      const res = await uploadAction(fd)
      if (res.error) setErr(res.error)
      else if (res.url) onUploaded(res.url)
    } catch {
      setErr('Upload failed')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-espresso-500 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {busy ? 'Uploading…' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
        onChange={handleChange}
        className="hidden"
      />
      {err && <span className="text-xs text-terracotta-600">{err}</span>}
    </div>
  )
}

function ImagePreview({ src, onClear }: { src: string; onClear: () => void }) {
  if (!src) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-200 text-xs text-espresso-300">
        No image
      </div>
    )
  }
  return (
    <div className="relative h-24 w-24 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Product preview" className="h-24 w-24 rounded-xl border border-gray-200 object-cover" />
      <button
        type="button"
        onClick={onClear}
        className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-terracotta-500 shadow border border-gray-200 hover:text-terracotta-700"
        aria-label="Remove image"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function ImageThumb({ src }: { src: string }) {
  if (!src) {
    return <div className="h-10 w-10 shrink-0 rounded-lg border border-dashed border-gray-200" />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 object-cover" />
}

// Generic updater for object-list state
function updateList<T extends Record<string, string>>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  index: number,
  key: keyof T,
  value: string,
) {
  setter((prev) => prev.map((item, i) => i === index ? { ...item, [key]: value } : item))
}

// Shared style strings
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-espresso-600 placeholder:text-espresso-300 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100'
const addBtnCls = 'inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-espresso-500 hover:bg-gray-50 transition-colors'
