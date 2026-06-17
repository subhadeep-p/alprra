export interface FAQItem {
  question: string
  answer: string
  category: string
}

export const globalFaqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What makes Alprra different from other healthy snack brands?',
    answer:
      'Alprra is built on three non-negotiables: recognisable ingredients (you should know every item on the list), honest nutrition (we never inflate protein with fillers or hide sugar under twelve different names), and freshness (every product is made in small batches and shipped fresh — no warehouse months here). We are also deeply rooted in Indian food traditions — millet, jaggery, ragi, jowar — because these ancient ingredients are genuinely superior, not just trendy.',
  },
  {
    category: 'General',
    question: 'Are Alprra products preservative-free?',
    answer:
      'Yes. We use zero artificial preservatives across our entire range. This is why our shelf lives are shorter than mass-market products — typically 10–45 days depending on the product. We view this as a feature, not a limitation: short shelf life is proof of freshness.',
  },
  {
    category: 'Ingredients',
    question: 'Why do you use coconut sugar instead of regular sugar?',
    answer:
      'Coconut sugar has a glycemic index of approximately 35, compared to 65 for white sugar. It also retains trace minerals — potassium, magnesium, zinc, and iron — that are stripped from refined sugar. It caramelises beautifully and has a slight butterscotch note that enhances baked goods. It is not a "free" food (it is still sugar by calories), but it is a meaningfully better choice.',
  },
  {
    category: 'Ingredients',
    question: 'What is so special about millet?',
    answer:
      'Millets — jowar (sorghum), bajra (pearl millet), ragi (finger millet), foxtail millet — are ancient Indian grains that were the backbone of Indian diets for thousands of years before refined wheat flour took over. They are naturally gluten-light, high in fiber, rich in micronutrients, and have lower glycemic indices than wheat. Ragi, for instance, has more calcium than milk per calorie. They are also climate-resilient, water-efficient crops — choosing millet is good for your body and the planet.',
  },
  {
    category: 'Ingredients',
    question: 'Why is jaggery a better sweetener than refined sugar?',
    answer:
      'Refined white sugar is essentially empty calories — all minerals and molasses are removed during processing. Jaggery (gur) retains iron, potassium, calcium, and magnesium from sugarcane. It has a lower glycemic index, provides a richer, more complex flavour, and traditionally supports digestion. It is not a health food in large quantities, but as a sweetener used in moderation, it is categorically better than refined sugar.',
  },
  {
    category: 'Orders & Delivery',
    question: 'How do I place an order?',
    answer:
      'Select your products, add them to your cart, and proceed to checkout. Fill in your delivery details, and on checkout you will be redirected to WhatsApp with your complete order summary — simply send the message and our team confirms your order within minutes. You will also receive an email confirmation.',
  },
  {
    category: 'Orders & Delivery',
    question: 'How long does delivery take?',
    answer:
      'We deliver within Bengaluru in 24–48 hours. Pan-India delivery takes 3–5 business days via courier. Freshly baked products (breads, cakes) require 24–48 hours of preparation time before dispatch. We ship only on weekdays.',
  },
  {
    category: 'Orders & Delivery',
    question: 'Do you offer bulk orders or corporate gifting?',
    answer:
      'Yes — we love corporate gifting orders and bulk orders for events, festivals, and gifting. We can create custom assortment boxes, branded packaging, and personalised messages. Contact us on WhatsApp or email for bulk pricing.',
  },
  {
    category: 'Health & Allergens',
    question: 'Are your products suitable for diabetics?',
    answer:
      'Several of our products use low-GI sweeteners (coconut sugar, jaggery, dates) and whole-grain flours that significantly reduce glycemic impact compared to conventional snacks. However, we are not a medical food brand and cannot make clinical claims. We recommend diabetic customers review the nutrition information for each product and consult their healthcare provider about portion sizes.',
  },
  {
    category: 'Health & Allergens',
    question: 'Do you have products suitable for children?',
    answer:
      'Yes — our Ragi Amaranth Energy Bites, Almond Millet Cookies, and Multigrain Seed Granola are particularly popular with children and parents. All our products use clean, whole-food ingredients. Always check allergen information, especially for nut-containing products, before giving to young children.',
  },
]
