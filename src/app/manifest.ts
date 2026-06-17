import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alprra — Healthy Snacks & Baked Goods',
    short_name: 'Alprra',
    description: 'Premium healthy snacks and baked goods made with clean, natural ingredients.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFAF4',
    theme_color: '#2D5016',
    orientation: 'portrait',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['food', 'shopping', 'health'],
  }
}
