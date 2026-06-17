export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  product?: string
  avatar?: string
  verified: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Bengaluru',
    rating: 5,
    text: 'I have been looking for a genuinely healthy cookie for years. The Almond Millet Cookies are the first ones I have found that taste amazing AND have ingredients I can actually recognise. My kids love them too — win!',
    product: 'Almond Millet Cookies',
    verified: true,
  },
  {
    id: '2',
    name: 'Rohan Mehta',
    location: 'Mumbai',
    rating: 5,
    text: 'The Multigrain Seed Granola is exceptional. I have tried every expensive imported granola brand — this beats all of them. The slow-baking makes a real difference in texture and you can actually taste the seeds.',
    product: 'Multigrain Seed Granola',
    verified: true,
  },
  {
    id: '3',
    name: 'Ananya Krishnan',
    location: 'Chennai',
    rating: 5,
    text: 'Ordered the Ragi Amaranth Energy Bites for my 3-year-old. The paediatrician was happy with the ingredients — high calcium from ragi is exactly what toddlers need. She loves the coconut-y taste!',
    product: 'Ragi Amaranth Energy Bites',
    verified: true,
  },
  {
    id: '4',
    name: 'Vikram Singh',
    location: 'Delhi',
    rating: 5,
    text: 'As someone who tracks macros, I am extremely skeptical of "healthy" bars. The Oats Honey Protein Bar is the real deal — 15g protein, clean ingredients list, no maltitol nonsense. And it tastes like an actual dessert.',
    product: 'Oats Honey Protein Bar',
    verified: true,
  },
  {
    id: '5',
    name: 'Deepa Nair',
    location: 'Kochi',
    rating: 5,
    text: 'The Coconut Jaggery Cake was the centrepiece of my mother\'s birthday. The entire family was shocked it was made with whole wheat and jaggery — it tasted like a premium bakery cake. Absolutely ordering again.',
    product: 'Coconut Jaggery Whole Wheat Cake',
    verified: true,
  },
  {
    id: '6',
    name: 'Sanjay Patel',
    location: 'Ahmedabad',
    rating: 5,
    text: 'The Jowar Peanut Chikki Bar brings back childhood chikki memories but makes it so much better. The jowar adds a lightness that regular chikki does not have. Perfect office snack — keeps me full for hours.',
    product: 'Jowar Peanut Chikki Bar',
    verified: true,
  },
]
