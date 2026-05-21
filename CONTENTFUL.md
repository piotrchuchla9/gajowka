# Contentful — content models

Załóż w UI Contentful (Content model → Add content type). API IDs muszą być **dokładnie** takie jak niżej.

## 1. Country

**Name:** Country · **API Identifier:** `country`

| Field name      | API ID        | Type                | Settings                                  |
|-----------------|---------------|---------------------|-------------------------------------------|
| Name            | `name`        | Short text          | Required, title field                     |
| Slug            | `slug`        | Short text          | Required, unique, slug pattern from `name`|
| Flag emoji      | `flagEmoji`   | Short text          | np. `🇬🇪`                                  |
| Description     | `description` | Long text (textarea)|                                           |
| Cover image     | `coverImage`  | Media (one file)    | Image                                     |
| Currency        | `currency`    | Short text          | np. `GEL`                                 |
| Visa info       | `visaInfo`    | Long text           |                                           |
| Best season     | `bestSeason`  | Short text          | np. `maj–wrzesień`                        |
| Order           | `order`       | Integer             | Sort order on listings                    |

## 2. Region

**Name:** Region · **API Identifier:** `region`

| Field name      | API ID         | Type                  | Settings                                |
|-----------------|----------------|-----------------------|-----------------------------------------|
| Name            | `name`         | Short text            | Required, title field                   |
| Slug            | `slug`         | Short text            | Required, unique                        |
| Country         | `country`      | Reference (one)       | Required, accept type: `country`        |
| Description     | `description`  | Long text             |                                         |
| Cover image     | `coverImage`   | Media (one)           | Image                                   |
| Map center lat  | `centerLat`    | Decimal               |                                         |
| Map center lng  | `centerLng`    | Decimal               |                                         |

## 3. Trip (Podróż)

**Name:** Trip · **API Identifier:** `trip`

| Field name        | API ID            | Type                            | Settings                                          |
|-------------------|-------------------|---------------------------------|---------------------------------------------------|
| Title             | `title`           | Short text                      | Required, title field                             |
| Slug              | `slug`            | Short text                      | Required, unique                                  |
| Excerpt           | `excerpt`         | Long text                       | Max 280 chars                                     |
| Region            | `region`          | Reference (one)                 | Required, accept type: `region`                   |
| Cover image       | `coverImage`      | Media (one)                     | Image, required                                   |
| Gallery           | `gallery`         | Media (many)                    | Images                                            |
| Body              | `body`            | Rich text                       | Enable embeds: assets, entries                    |
| Date start        | `dateStart`       | Date                            | Required                                          |
| Date end          | `dateEnd`         | Date                            |                                                   |
| Distance km       | `distanceKm`      | Integer                         |                                                   |
| Cost total PLN    | `costTotal`       | Integer                         |                                                   |
| Cost breakdown    | `costBreakdown`   | JSON object                     | `{ "noclegi": 0, "jedzenie": 0, "transport": 0 }` |
| Tags              | `tags`            | Short text, list                | np. `góry`, `trekking`, `stop`                    |
| GPX file          | `gpxFile`         | Media (one)                     | .gpx                                              |
| Map pin lat       | `pinLat`          | Decimal                         | For world map                                     |
| Map pin lng       | `pinLng`          | Decimal                         |                                                   |
| Instagram URL     | `instagramUrl`    | Short text                      |                                                   |
| Featured          | `featured`        | Boolean                         | Show in homepage hero rotation                    |

## 4. Author (pojedynczy)

**Name:** Author · **API Identifier:** `author`

| Field name | API ID    | Type        |
|------------|-----------|-------------|
| Name       | `name`    | Short text  |
| Bio        | `bio`     | Long text   |
| Avatar     | `avatar`  | Media (one) |
| Signature  | `signature` | Short text |
| Instagram  | `instagram` | Short text |

## 5. Site settings (singleton)

**Name:** Site Settings · **API Identifier:** `siteSettings`

| Field name      | API ID        | Type        |
|-----------------|---------------|-------------|
| Hero title      | `heroTitle`   | Short text  |
| Hero subtitle   | `heroSubtitle`| Short text  |
| Hero image      | `heroImage`   | Media (one) |
| Stats: countries| `statCountries` | Integer   |
| Stats: days     | `statDays`    | Integer     |
| Stats: km       | `statKm`      | Integer     |

---

## Tokens

Settings → API keys → Add API key:
- **Content Delivery API token** → `CONTENTFUL_ACCESS_TOKEN`
- **Content Preview API token** → `CONTENTFUL_PREVIEW_TOKEN`
- Space ID → `CONTENTFUL_SPACE_ID`

Wklej do `.env` (skopiuj z `.env.example`).

## Webhooks → Vercel

Settings → Webhooks → Add:
- URL: deploy hook z Vercel (Project → Settings → Git → Deploy Hooks)
- Triggers: Publish/Unpublish dla `trip`, `country`, `region`, `siteSettings`
