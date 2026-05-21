// Idempotent: tworzy content types + sample entries via plain CMA API.
import 'dotenv/config';
import { createClient } from 'contentful-management';

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MGMT_TOKEN;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!SPACE || !TOKEN) {
  console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MGMT_TOKEN');
  process.exit(1);
}

const cf = createClient({ accessToken: TOKEN }, {
  type: 'plain',
  defaults: { spaceId: SPACE, environmentId: ENV },
});

const isNotFound = (e) => e?.name === 'NotFound' || /not.?found|404/i.test(e?.message || '');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ===== CONTENT TYPES =====

const TYPES = [
  {
    id: 'country', name: 'Country', displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, validations: [{ unique: true }] },
      { id: 'flagEmoji', name: 'Flag emoji', type: 'Symbol' },
      { id: 'description', name: 'Description', type: 'Text' },
      { id: 'coverImage', name: 'Cover image', type: 'Link', linkType: 'Asset' },
      { id: 'currency', name: 'Currency', type: 'Symbol' },
      { id: 'visaInfo', name: 'Visa info', type: 'Text' },
      { id: 'bestSeason', name: 'Best season', type: 'Symbol' },
      { id: 'order', name: 'Order', type: 'Integer' },
    ],
  },
  {
    id: 'region', name: 'Region', displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, validations: [{ unique: true }] },
      { id: 'country', name: 'Country', type: 'Link', linkType: 'Entry', required: true,
        validations: [{ linkContentType: ['country'] }] },
      { id: 'description', name: 'Description', type: 'Text' },
      { id: 'coverImage', name: 'Cover image', type: 'Link', linkType: 'Asset' },
      { id: 'centerLat', name: 'Map center lat', type: 'Number' },
      { id: 'centerLng', name: 'Map center lng', type: 'Number' },
    ],
  },
  {
    id: 'trip', name: 'Trip', displayField: 'title',
    fields: [
      { id: 'title', name: 'Title', type: 'Symbol', required: true },
      { id: 'slug', name: 'Slug', type: 'Symbol', required: true, validations: [{ unique: true }] },
      { id: 'excerpt', name: 'Excerpt', type: 'Text', validations: [{ size: { max: 280 } }] },
      { id: 'region', name: 'Region', type: 'Link', linkType: 'Entry', required: true,
        validations: [{ linkContentType: ['region'] }] },
      { id: 'coverImage', name: 'Cover image', type: 'Link', linkType: 'Asset', required: true },
      { id: 'gallery', name: 'Gallery', type: 'Array', items: { type: 'Link', linkType: 'Asset' } },
      { id: 'body', name: 'Body', type: 'RichText' },
      { id: 'dateStart', name: 'Date start', type: 'Date', required: true },
      { id: 'dateEnd', name: 'Date end', type: 'Date' },
      { id: 'distanceKm', name: 'Distance km', type: 'Integer' },
      { id: 'costTotal', name: 'Cost total PLN', type: 'Integer' },
      { id: 'costBreakdown', name: 'Cost breakdown', type: 'Object' },
      { id: 'tags', name: 'Tags', type: 'Array', items: { type: 'Symbol' } },
      { id: 'gpxFile', name: 'GPX file', type: 'Link', linkType: 'Asset' },
      { id: 'pinLat', name: 'Map pin lat', type: 'Number' },
      { id: 'pinLng', name: 'Map pin lng', type: 'Number' },
      { id: 'instagramUrl', name: 'Instagram URL', type: 'Symbol' },
      { id: 'featured', name: 'Featured', type: 'Boolean' },
    ],
  },
  {
    id: 'author', name: 'Author', displayField: 'name',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol', required: true },
      { id: 'bio', name: 'Bio', type: 'Text' },
      { id: 'avatar', name: 'Avatar', type: 'Link', linkType: 'Asset' },
      { id: 'signature', name: 'Signature', type: 'Symbol' },
      { id: 'instagram', name: 'Instagram', type: 'Symbol' },
    ],
  },
  {
    id: 'siteSettings', name: 'Site Settings', displayField: 'heroTitle',
    fields: [
      { id: 'heroTitle', name: 'Hero title', type: 'Symbol' },
      { id: 'heroSubtitle', name: 'Hero subtitle', type: 'Symbol' },
      { id: 'heroImage', name: 'Hero image', type: 'Link', linkType: 'Asset' },
      { id: 'statCountries', name: 'Stat: countries', type: 'Integer' },
      { id: 'statDays', name: 'Stat: days', type: 'Integer' },
      { id: 'statKm', name: 'Stat: km', type: 'Integer' },
    ],
  },
];

async function upsertContentType(def) {
  let ct;
  try {
    ct = await cf.contentType.get({ contentTypeId: def.id });
    ct.name = def.name;
    ct.displayField = def.displayField;
    ct.fields = def.fields;
    ct = await cf.contentType.update({ contentTypeId: def.id }, ct);
    await cf.contentType.publish({ contentTypeId: def.id }, ct);
    console.log(`  ↻ ${def.id}`);
  } catch (e) {
    if (!isNotFound(e)) throw e;
    ct = await cf.contentType.createWithId(
      { contentTypeId: def.id },
      { name: def.name, displayField: def.displayField, fields: def.fields }
    );
    await cf.contentType.publish({ contentTypeId: def.id }, ct);
    console.log(`  + ${def.id}`);
  }
}

console.log('== Content types ==');
for (const t of TYPES) await upsertContentType(t);

// ===== ASSETS =====

async function upsertAsset(id, url, title) {
  try {
    return await cf.asset.get({ assetId: id });
  } catch (e) {
    if (!isNotFound(e)) throw e;
  }
  let asset = await cf.asset.createWithId({ assetId: id }, {
    fields: {
      title: { 'en-US': title },
      file: { 'en-US': {
        contentType: 'image/jpeg',
        fileName: `${id}.jpg`,
        upload: url,
      } },
    },
  });
  asset = await cf.asset.processForAllLocales({}, asset);
  for (let i = 0; i < 30; i++) {
    asset = await cf.asset.get({ assetId: id });
    if (asset.fields.file?.['en-US']?.url) break;
    await sleep(1000);
  }
  await cf.asset.publish({ assetId: id }, asset);
  console.log(`  + ${id}`);
  return asset;
}

console.log('\n== Assets ==');
const ASSETS = [
  ['asset-hero', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80', 'Hero'],
  ['asset-gruzja', 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1600&q=80', 'Gruzja cover'],
  ['asset-albania', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80', 'Albania cover'],
  ['asset-islandia', 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=1600&q=80', 'Islandia cover'],
  ['asset-mestia', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80', 'Mestia'],
  ['asset-theth', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80', 'Theth'],
  ['asset-westfjords', 'https://images.unsplash.com/photo-1490650404312-a2175773bbf5?w=1600&q=80', 'Westfjords'],
  ['asset-avatar', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80', 'Avatar'],
];

for (const [id, url, title] of ASSETS) {
  await upsertAsset(id, url, title);
}

// ===== ENTRIES =====

async function upsertEntry(contentTypeId, id, fields) {
  const wrapped = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, { 'en-US': v }])
  );
  try {
    let entry = await cf.entry.get({ entryId: id });
    entry.fields = wrapped;
    entry = await cf.entry.update({ entryId: id }, entry);
    await cf.entry.publish({ entryId: id }, entry);
    console.log(`  ↻ ${id}`);
    return entry;
  } catch (e) {
    if (!isNotFound(e)) throw e;
    let entry = await cf.entry.createWithId(
      { contentTypeId, entryId: id },
      { fields: wrapped }
    );
    await cf.entry.publish({ entryId: id }, entry);
    console.log(`  + ${id}`);
    return entry;
  }
}

const link = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } });
const assetLink = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });
const richText = (text) => ({
  nodeType: 'document', data: {},
  content: text.split('\n\n').map(p => ({
    nodeType: 'paragraph', data: {},
    content: [{ nodeType: 'text', value: p, marks: [], data: {} }],
  })),
});

console.log('\n== Entries ==');

await upsertEntry('siteSettings', 'site-settings', {
  heroTitle: 'w drodze przez',
  heroSubtitle: 'notatki, zdjęcia i koszty z wędrówek po krajach mniej oczywistych.',
  heroImage: assetLink('asset-hero'),
  statCountries: 23, statDays: 147, statKm: 18480,
});

await upsertEntry('author', 'author-main', {
  name: 'Ania',
  bio: 'Od pięciu lat zapisuję każdą podróż — bilety, ślady GPX, ceny chleba na bazarach. Tu spisuję to wszystko zamiast gubić w notatkach telefonu. Najczęściej Bałkany, Kaukaz i północ. Najchętniej autobusem, marszrutką, stopem.',
  avatar: assetLink('asset-avatar'),
  signature: '— do zobaczenia w drodze',
  instagram: 'gajowka.w.drodze',
});

await upsertEntry('country', 'country-gruzja', {
  name: 'Gruzja', slug: 'gruzja', flagEmoji: '🇬🇪',
  description: 'Kaukaz po gruzińsku — wieże w Swaneti, wino w Kachetii, marszrutki wszędzie.',
  coverImage: assetLink('asset-gruzja'),
  currency: 'GEL', visaInfo: 'Bezwizowo do 1 roku.', bestSeason: 'maj–październik', order: 1,
});
await upsertEntry('country', 'country-albania', {
  name: 'Albania', slug: 'albania', flagEmoji: '🇦🇱',
  description: 'Alpy Albańskie i Riwiera Albańska. Kraj który dopiero się "otwiera".',
  coverImage: assetLink('asset-albania'),
  currency: 'ALL', visaInfo: 'Bezwizowo do 90 dni.', bestSeason: 'maj–wrzesień', order: 2,
});
await upsertEntry('country', 'country-islandia', {
  name: 'Islandia', slug: 'islandia', flagEmoji: '🇮🇸',
  description: 'Strefa Schengen, ocean, fiordy, źródła gorące.',
  coverImage: assetLink('asset-islandia'),
  currency: 'ISK', visaInfo: 'Schengen.', bestSeason: 'czerwiec–sierpień (lato), styczeń–luty (zima)', order: 3,
});

await upsertEntry('region', 'region-swaneti', {
  name: 'Swaneti', slug: 'swaneti', country: link('country-gruzja'),
  description: 'Wysokogórski region Gruzji ze średniowiecznymi wieżami obronnymi.',
  centerLat: 42.7, centerLng: 42.7,
});
await upsertEntry('region', 'region-theth', {
  name: 'Theth', slug: 'theth', country: link('country-albania'),
  description: 'Wioska w sercu Alp Albańskich, brama na przełęcz Valbona.',
  centerLat: 42.39, centerLng: 19.78,
});
await upsertEntry('region', 'region-westfjords', {
  name: 'Westfjords', slug: 'westfjords', country: link('country-islandia'),
  description: 'Zachodnie fiordy — najmniej odwiedzona część Islandii.',
  centerLat: 65.8, centerLng: -23.5,
});

await upsertEntry('trip', 'trip-mestia', {
  title: 'trekking przez wieże Mestii',
  slug: 'mestia-trekking',
  excerpt: 'Pięć dni między kamiennymi wieżami i pasterskimi kolibami.',
  region: link('region-swaneti'),
  coverImage: assetLink('asset-mestia'),
  body: richText('Wieże w Mestii stoją tu od XII wieku.\n\nPierwsze dwa dni rozgrzewka po regionie. Trzeciego dnia ruszamy na Chalaadi Glacier. Czwartego — Ushguli, najwyższa stale zamieszkana wioska w Europie. Piąty — zejście marszrutką.\n\nNajwiększy plus: pasterskie kolibki które serwują chaczapuri za grosze.'),
  dateStart: '2026-04-12', dateEnd: '2026-04-17',
  distanceKm: 84, costTotal: 1240,
  costBreakdown: { noclegi: 420, jedzenie: 380, transport: 320, atrakcje: 120 },
  tags: ['góry', 'trekking', 'kaukaz'],
  pinLat: 42.7, pinLng: 42.7,
  featured: true,
});
await upsertEntry('trip', 'trip-valbona-theth', {
  title: 'przełęcz Valbona–Theth bez tłumów',
  slug: 'valbona-theth',
  excerpt: 'Co się dzieje w Akropolu gdy turyści zostaną w Tiranie.',
  region: link('region-theth'),
  coverImage: assetLink('asset-theth'),
  body: richText('Klasyczne 17 km przejście między dwiema wioskami w Alpach Albańskich.\n\nStartujemy o 6:00 z Valbony. O 9:00 jesteśmy na przełęczy — sami. Schodzenie do Theth zajmuje 4 godziny.\n\nNocujemy w guesthouse "Bujtina Polia" za 15 euro z kolacją.'),
  dateStart: '2026-03-08', dateEnd: '2026-03-09',
  distanceKm: 17, costTotal: 380,
  costBreakdown: { noclegi: 60, jedzenie: 80, transport: 240 },
  tags: ['góry', 'trekking', 'stop'],
  pinLat: 42.39, pinLng: 19.78,
  featured: true,
});
await upsertEntry('trip', 'trip-westfjords', {
  title: 'zimą do zachodnich fiordów',
  slug: 'westfjords-zima',
  excerpt: 'Pustka, foki, gorące źródła nad oceanem.',
  region: link('region-westfjords'),
  coverImage: assetLink('asset-westfjords'),
  body: richText('Westfjords w lutym to inny świat niż Złoty Krąg.\n\nDojechałam wynajętym Dacia Duster z Reykjaviku w 8 godzin. Po drodze: foki na plaży Ytri-Tunga, gorące źródło Hellulaug otwarte 24/7.\n\nPolarna noc kończy się około 14:00.'),
  dateStart: '2026-02-02', dateEnd: '2026-02-08',
  distanceKm: 612, costTotal: 4200,
  costBreakdown: { noclegi: 1800, jedzenie: 900, transport: 1300, atrakcje: 200 },
  tags: ['zima', 'samochód', 'fiordy'],
  pinLat: 65.8, pinLng: -23.5,
  featured: false,
});

console.log('\n✓ Done.');
