import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://gajowka.example',
  output: 'static',
  adapter: vercel({ imageService: true }),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  image: {
    domains: ['images.ctfassets.net', 'images.unsplash.com'],
  },
});
