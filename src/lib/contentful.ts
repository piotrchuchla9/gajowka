import { createClient, type Entry, type EntryFieldTypes } from 'contentful';

const spaceId = import.meta.env.CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.CONTENTFUL_ACCESS_TOKEN;
const environment = import.meta.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!spaceId || !accessToken) {
  console.warn('[contentful] Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN — używam pustego clienta.');
}

export const cf = createClient({
  space: spaceId ?? 'missing',
  accessToken: accessToken ?? 'missing',
  environment,
});

// ----- TypeScript skeletons matching CONTENTFUL.md -----

export type CountrySkeleton = {
  contentTypeId: 'country';
  fields: {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    flagEmoji?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    coverImage?: EntryFieldTypes.AssetLink;
    currency?: EntryFieldTypes.Symbol;
    visaInfo?: EntryFieldTypes.Text;
    bestSeason?: EntryFieldTypes.Symbol;
    order?: EntryFieldTypes.Integer;
  };
};

export type RegionSkeleton = {
  contentTypeId: 'region';
  fields: {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    country: EntryFieldTypes.EntryLink<CountrySkeleton>;
    description?: EntryFieldTypes.Text;
    coverImage?: EntryFieldTypes.AssetLink;
    centerLat?: EntryFieldTypes.Number;
    centerLng?: EntryFieldTypes.Number;
  };
};

export type TripSkeleton = {
  contentTypeId: 'trip';
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    excerpt?: EntryFieldTypes.Text;
    region: EntryFieldTypes.EntryLink<RegionSkeleton>;
    coverImage: EntryFieldTypes.AssetLink;
    gallery?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    body?: EntryFieldTypes.RichText;
    dateStart: EntryFieldTypes.Date;
    dateEnd?: EntryFieldTypes.Date;
    distanceKm?: EntryFieldTypes.Integer;
    costTotal?: EntryFieldTypes.Integer;
    costBreakdown?: EntryFieldTypes.Object;
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    gpxFile?: EntryFieldTypes.AssetLink;
    pinLat?: EntryFieldTypes.Number;
    pinLng?: EntryFieldTypes.Number;
    instagramUrl?: EntryFieldTypes.Symbol;
    featured?: EntryFieldTypes.Boolean;
  };
};

export type AuthorSkeleton = {
  contentTypeId: 'author';
  fields: {
    name: EntryFieldTypes.Symbol;
    bio?: EntryFieldTypes.Text;
    avatar?: EntryFieldTypes.AssetLink;
    signature?: EntryFieldTypes.Symbol;
    instagram?: EntryFieldTypes.Symbol;
  };
};

export type SiteSettingsSkeleton = {
  contentTypeId: 'siteSettings';
  fields: {
    heroTitle?: EntryFieldTypes.Symbol;
    heroSubtitle?: EntryFieldTypes.Symbol;
    heroImage?: EntryFieldTypes.AssetLink;
    statCountries?: EntryFieldTypes.Integer;
    statDays?: EntryFieldTypes.Integer;
    statKm?: EntryFieldTypes.Integer;
  };
};

export type Country = Entry<CountrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>;
export type Region = Entry<RegionSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>;
export type Trip = Entry<TripSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>;
export type Author = Entry<AuthorSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>;
export type SiteSettings = Entry<SiteSettingsSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>;

// ----- Queries -----

const safe = async <T>(p: Promise<T>, fallback: T): Promise<T> => {
  try { return await p; } catch (e) {
    console.warn('[contentful] query failed, fallback used:', e instanceof Error ? e.message : e);
    return fallback;
  }
};

export async function getLatestTrips(limit = 6) {
  return safe(
    cf.withoutUnresolvableLinks.getEntries<TripSkeleton>({
      content_type: 'trip',
      order: ['-fields.dateStart'],
      limit,
      include: 2,
    }),
    { items: [] } as any,
  );
}

export async function getFeaturedTrips(limit = 3) {
  return safe(
    cf.withoutUnresolvableLinks.getEntries<TripSkeleton>({
      content_type: 'trip',
      'fields.featured': true,
      order: ['-fields.dateStart'],
      limit,
      include: 2,
    }),
    { items: [] } as any,
  );
}

export async function getAllTrips() {
  return safe(
    cf.withoutUnresolvableLinks.getEntries<TripSkeleton>({
      content_type: 'trip',
      order: ['-fields.dateStart'],
      limit: 1000,
      include: 2,
    }),
    { items: [] } as any,
  );
}

export async function getTripBySlug(slug: string) {
  const res = await safe(
    cf.withoutUnresolvableLinks.getEntries<TripSkeleton>({
      content_type: 'trip',
      'fields.slug': slug,
      limit: 1,
      include: 3,
    }),
    { items: [] } as any,
  );
  return res.items[0] ?? null;
}

export async function getAllCountries() {
  return safe(
    cf.withoutUnresolvableLinks.getEntries<CountrySkeleton>({
      content_type: 'country',
      order: ['fields.order', 'fields.name'],
      limit: 200,
    }),
    { items: [] } as any,
  );
}

export async function getCountryBySlug(slug: string) {
  const res = await safe(
    cf.withoutUnresolvableLinks.getEntries<CountrySkeleton>({
      content_type: 'country',
      'fields.slug': slug,
      limit: 1,
    }),
    { items: [] } as any,
  );
  return res.items[0] ?? null;
}

export async function getRegionsByCountry(countryId: string) {
  return safe(
    cf.withoutUnresolvableLinks.getEntries<RegionSkeleton>({
      content_type: 'region',
      'fields.country.sys.id': countryId,
      order: ['fields.name'],
      limit: 200,
    }),
    { items: [] } as any,
  );
}

export async function getRegionBySlug(slug: string) {
  const res = await safe(
    cf.withoutUnresolvableLinks.getEntries<RegionSkeleton>({
      content_type: 'region',
      'fields.slug': slug,
      limit: 1,
      include: 2,
    }),
    { items: [] } as any,
  );
  return res.items[0] ?? null;
}

export async function getTripsByRegion(regionId: string) {
  return safe(
    cf.withoutUnresolvableLinks.getEntries<TripSkeleton>({
      content_type: 'trip',
      'fields.region.sys.id': regionId,
      order: ['-fields.dateStart'],
      limit: 200,
      include: 2,
    }),
    { items: [] } as any,
  );
}

export async function getSiteSettings() {
  const res = await safe(
    cf.withoutUnresolvableLinks.getEntries<SiteSettingsSkeleton>({
      content_type: 'siteSettings',
      limit: 1,
    }),
    { items: [] } as any,
  );
  return res.items[0] ?? null;
}

export async function getAuthor() {
  const res = await safe(
    cf.withoutUnresolvableLinks.getEntries<AuthorSkeleton>({
      content_type: 'author',
      limit: 1,
    }),
    { items: [] } as any,
  );
  return res.items[0] ?? null;
}

// ----- Asset URL helper -----

export function assetUrl(asset: any, opts: { w?: number; h?: number; fit?: string; q?: number } = {}) {
  const url = asset?.fields?.file?.url;
  if (!url) return '';
  const base = url.startsWith('//') ? `https:${url}` : url;
  const params = new URLSearchParams();
  if (opts.w) params.set('w', String(opts.w));
  if (opts.h) params.set('h', String(opts.h));
  if (opts.fit) params.set('fit', opts.fit);
  params.set('q', String(opts.q ?? 80));
  params.set('fm', 'webp');
  return `${base}?${params.toString()}`;
}
