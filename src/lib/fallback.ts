// Fallback dane gdy Contentful nie skonfigurowany — preview działa od razu po `npm run dev`.

export type FallbackTrip = {
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  country: string;
  countrySlug: string;
  region: string;
  regionSlug: string;
  date: string;
  distanceKm: number;
  costTotal: number;
  tags: string[];
  pin: [number, number];
};

export type FallbackCountry = {
  name: string;
  slug: string;
  flag: string;
  cover: string;
  trips: number;
};

export const FALLBACK_TRIPS: FallbackTrip[] = [
  {
    title: 'trekking przez wieże Mestii',
    slug: 'mestia-trekking',
    excerpt: 'Pięć dni między kamiennymi wieżami i pasterskimi kolibami.',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    country: 'Gruzja', countrySlug: 'gruzja',
    region: 'Swaneti', regionSlug: 'swaneti',
    date: '2026-04-12',
    distanceKm: 84, costTotal: 1240,
    tags: ['góry', 'trekking'],
    pin: [42.7, 42.7],
  },
  {
    title: 'przełęcz Valbona–Theth bez tłumów',
    slug: 'valbona-theth',
    excerpt: 'Co się dzieje w Akropolu gdy turyści zostaną w Tiranie.',
    cover: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80',
    country: 'Albania', countrySlug: 'albania',
    region: 'Theth', regionSlug: 'theth',
    date: '2026-03-08',
    distanceKm: 17, costTotal: 380,
    tags: ['góry', 'trekking', 'stop'],
    pin: [42.39, 19.78],
  },
  {
    title: 'zimą do zachodnich fiordów',
    slug: 'westfjords-zima',
    excerpt: 'Pustka, foki, gorące źródła nad oceanem.',
    cover: 'https://images.unsplash.com/photo-1490650404312-a2175773bbf5?w=1200&q=80',
    country: 'Islandia', countrySlug: 'islandia',
    region: 'Westfjords', regionSlug: 'westfjords',
    date: '2026-02-02',
    distanceKm: 612, costTotal: 4200,
    tags: ['zima', 'samochód', 'fiordy'],
    pin: [65.8, -23.5],
  },
];

export const FALLBACK_COUNTRIES: FallbackCountry[] = [
  { name: 'Gruzja', slug: 'gruzja', flag: '🇬🇪', cover: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80', trips: 7 },
  { name: 'Albania', slug: 'albania', flag: '🇦🇱', cover: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', trips: 4 },
  { name: 'Islandia', slug: 'islandia', flag: '🇮🇸', cover: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=800&q=80', trips: 3 },
  { name: 'Norwegia', slug: 'norwegia', flag: '🇳🇴', cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', trips: 5 },
];

export const FALLBACK_STATS = {
  countries: 23,
  days: 147,
  km: 18480,
};

export const FALLBACK_HERO = {
  title: 'w drodze przez',
  titleAccent: 'dzikie miejsca',
  subtitle: 'notatki, zdjęcia i koszty z wędrówek po krajach mniej oczywistych.',
  image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80',
};
