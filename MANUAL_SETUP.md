# Manual Contentful Setup

Instrukcja krok-po-kliku. PAT/CMA nie działa, więc wszystko ręcznie w UI.

**Czas:** ~45 min. **Field IDs (API ID) muszą być EXACT — kod ich używa.**

Po skończeniu: `npm run dev` → strona zaciągnie dane z Contentful (CDA token już działa).

---

## 1. Content Types

UI: lewy sidebar → **Content model** → **Add content type**.

Dla każdego type: ustaw **Name** + **Api Identifier** (UI generuje z Name, ale **sprawdź czy zgadza się 1:1 z tym co poniżej**). Po dodaniu — Save → **Publish**.

Dla każdego field: **Add field** → wybierz typ → ustaw **Name** + **Field ID** (znowu: musi się zgadzać 1:1). Niektóre wymagają dodatkowych ustawień — opisane niżej.

### 1.1 Country
- **Name:** `Country`  | **Api ID:** `country` | **Display field:** `name`

| Field ID | Name | Type | Required | Extra |
|---|---|---|---|---|
| `name` | Name | Short text | ✓ | |
| `slug` | Slug | Short text | ✓ | Validations → Unique |
| `flagEmoji` | Flag emoji | Short text | | |
| `description` | Description | Long text | | |
| `coverImage` | Cover image | Media → One file | | |
| `currency` | Currency | Short text | | |
| `visaInfo` | Visa info | Long text | | |
| `bestSeason` | Best season | Short text | | |
| `order` | Order | Integer | | |

### 1.2 Region
- **Name:** `Region` | **Api ID:** `region` | **Display field:** `name`

| Field ID | Name | Type | Required | Extra |
|---|---|---|---|---|
| `name` | Name | Short text | ✓ | |
| `slug` | Slug | Short text | ✓ | Validations → Unique |
| `country` | Country | Reference → One entry | ✓ | Validations → Accept only `country` |
| `description` | Description | Long text | | |
| `coverImage` | Cover image | Media → One file | | |
| `centerLat` | Map center lat | Decimal number | | |
| `centerLng` | Map center lng | Decimal number | | |

### 1.3 Trip
- **Name:** `Trip` | **Api ID:** `trip` | **Display field:** `title`

| Field ID | Name | Type | Required | Extra |
|---|---|---|---|---|
| `title` | Title | Short text | ✓ | |
| `slug` | Slug | Short text | ✓ | Validations → Unique |
| `excerpt` | Excerpt | Long text | | Validations → Limit char count, max 280 |
| `region` | Region | Reference → One entry | ✓ | Validations → Accept only `region` |
| `coverImage` | Cover image | Media → One file | ✓ | |
| `gallery` | Gallery | Media → Many files | | |
| `body` | Body | Rich text | | |
| `dateStart` | Date start | Date & time | ✓ | |
| `dateEnd` | Date end | Date & time | | |
| `distanceKm` | Distance km | Integer | | |
| `costTotal` | Cost total PLN | Integer | | |
| `costBreakdown` | Cost breakdown | JSON object | | |
| `tags` | Tags | Short text, list | | |
| `gpxFile` | GPX file | Media → One file | | |
| `pinLat` | Map pin lat | Decimal number | | |
| `pinLng` | Map pin lng | Decimal number | | |
| `instagramUrl` | Instagram URL | Short text | | |
| `featured` | Featured | Boolean | | |

### 1.4 Author
- **Name:** `Author` | **Api ID:** `author` | **Display field:** `name`

| Field ID | Name | Type | Required |
|---|---|---|---|
| `name` | Name | Short text | ✓ |
| `bio` | Bio | Long text | |
| `avatar` | Avatar | Media → One file | |
| `signature` | Signature | Short text | |
| `instagram` | Instagram | Short text | |

### 1.5 Site Settings
- **Name:** `Site Settings` | **Api ID:** `siteSettings` | **Display field:** `heroTitle`

| Field ID | Name | Type |
|---|---|---|
| `heroTitle` | Hero title | Short text |
| `heroSubtitle` | Hero subtitle | Short text |
| `heroImage` | Hero image | Media → One file |
| `statCountries` | Stat: countries | Integer |
| `statDays` | Stat: days | Integer |
| `statKm` | Stat: km | Integer |

---

## 2. Media (Assets)

UI: lewy sidebar → **Media** → **Add asset** → "Add new" → wklej URL lub upload.

| Title | URL |
|---|---|
| Hero | https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80 |
| Gruzja cover | https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1600&q=80 |
| Albania cover | https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80 |
| Islandia cover | https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=1600&q=80 |
| Mestia | https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80 |
| Theth | https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80 |
| Westfjords | https://images.unsplash.com/photo-1490650404312-a2175773bbf5?w=1600&q=80 |
| Avatar | https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80 |

Po każdym uploadzie: **Publish**.

---

## 3. Entries

UI: lewy sidebar → **Content** → **Add entry** → wybierz content type.

Po wpisaniu pól: **Publish**.

### 3.1 Site Settings (1 entry)
- **heroTitle:** `w drodze przez`
- **heroSubtitle:** `notatki, zdjęcia i koszty z wędrówek po krajach mniej oczywistych.`
- **heroImage:** Hero
- **statCountries:** `23`
- **statDays:** `147`
- **statKm:** `18480`

### 3.2 Author (1 entry)
- **name:** `Ania`
- **bio:** `Od pięciu lat zapisuję każdą podróż — bilety, ślady GPX, ceny chleba na bazarach. Tu spisuję to wszystko zamiast gubić w notatkach telefonu. Najczęściej Bałkany, Kaukaz i północ. Najchętniej autobusem, marszrutką, stopem.`
- **avatar:** Avatar
- **signature:** `— do zobaczenia w drodze`
- **instagram:** `gajowka.w.drodze`

### 3.3 Country (3 entries)

**Gruzja**
- name: `Gruzja` | slug: `gruzja` | flagEmoji: `🇬🇪`
- description: `Kaukaz po gruzińsku — wieże w Swaneti, wino w Kachetii, marszrutki wszędzie.`
- coverImage: Gruzja cover | currency: `GEL` | visaInfo: `Bezwizowo do 1 roku.`
- bestSeason: `maj–październik` | order: `1`

**Albania**
- name: `Albania` | slug: `albania` | flagEmoji: `🇦🇱`
- description: `Alpy Albańskie i Riwiera Albańska. Kraj który dopiero się "otwiera".`
- coverImage: Albania cover | currency: `ALL` | visaInfo: `Bezwizowo do 90 dni.`
- bestSeason: `maj–wrzesień` | order: `2`

**Islandia**
- name: `Islandia` | slug: `islandia` | flagEmoji: `🇮🇸`
- description: `Strefa Schengen, ocean, fiordy, źródła gorące.`
- coverImage: Islandia cover | currency: `ISK` | visaInfo: `Schengen.`
- bestSeason: `czerwiec–sierpień (lato), styczeń–luty (zima)` | order: `3`

### 3.4 Region (3 entries)

**Swaneti**
- name: `Swaneti` | slug: `swaneti` | country: Gruzja
- description: `Wysokogórski region Gruzji ze średniowiecznymi wieżami obronnymi.`
- centerLat: `42.7` | centerLng: `42.7`

**Theth**
- name: `Theth` | slug: `theth` | country: Albania
- description: `Wioska w sercu Alp Albańskich, brama na przełęcz Valbona.`
- centerLat: `42.39` | centerLng: `19.78`

**Westfjords**
- name: `Westfjords` | slug: `westfjords` | country: Islandia
- description: `Zachodnie fiordy — najmniej odwiedzona część Islandii.`
- centerLat: `65.8` | centerLng: `-23.5`

### 3.5 Trip (3 entries)

**trekking przez wieże Mestii**
- title: `trekking przez wieże Mestii` | slug: `mestia-trekking`
- excerpt: `Pięć dni między kamiennymi wieżami i pasterskimi kolibami.`
- region: Swaneti | coverImage: Mestia
- body (Rich text — 3 paragrafy):
  > Wieże w Mestii stoją tu od XII wieku.
  >
  > Pierwsze dwa dni rozgrzewka po regionie. Trzeciego dnia ruszamy na Chalaadi Glacier. Czwartego — Ushguli, najwyższa stale zamieszkana wioska w Europie. Piąty — zejście marszrutką.
  >
  > Największy plus: pasterskie kolibki które serwują chaczapuri za grosze.
- dateStart: `2026-04-12` | dateEnd: `2026-04-17`
- distanceKm: `84` | costTotal: `1240`
- costBreakdown (JSON): `{"noclegi":420,"jedzenie":380,"transport":320,"atrakcje":120}`
- tags: `góry, trekking, kaukaz` (3 osobne taggi)
- pinLat: `42.7` | pinLng: `42.7` | featured: `true`

**przełęcz Valbona–Theth bez tłumów**
- title: `przełęcz Valbona–Theth bez tłumów` | slug: `valbona-theth`
- excerpt: `Co się dzieje w Akropolu gdy turyści zostaną w Tiranie.`
- region: Theth | coverImage: Theth
- body:
  > Klasyczne 17 km przejście między dwiema wioskami w Alpach Albańskich.
  >
  > Startujemy o 6:00 z Valbony. O 9:00 jesteśmy na przełęczy — sami. Schodzenie do Theth zajmuje 4 godziny.
  >
  > Nocujemy w guesthouse "Bujtina Polia" za 15 euro z kolacją.
- dateStart: `2026-03-08` | dateEnd: `2026-03-09`
- distanceKm: `17` | costTotal: `380`
- costBreakdown: `{"noclegi":60,"jedzenie":80,"transport":240}`
- tags: `góry, trekking, stop`
- pinLat: `42.39` | pinLng: `19.78` | featured: `true`

**zimą do zachodnich fiordów**
- title: `zimą do zachodnich fiordów` | slug: `westfjords-zima`
- excerpt: `Pustka, foki, gorące źródła nad oceanem.`
- region: Westfjords | coverImage: Westfjords
- body:
  > Westfjords w lutym to inny świat niż Złoty Krąg.
  >
  > Dojechałam wynajętym Dacia Duster z Reykjaviku w 8 godzin. Po drodze: foki na plaży Ytri-Tunga, gorące źródło Hellulaug otwarte 24/7.
  >
  > Polarna noc kończy się około 14:00.
- dateStart: `2026-02-02` | dateEnd: `2026-02-08`
- distanceKm: `612` | costTotal: `4200`
- costBreakdown: `{"noclegi":1800,"jedzenie":900,"transport":1300,"atrakcje":200}`
- tags: `zima, samochód, fiordy`
- pinLat: `65.8` | pinLng: `-23.5` | featured: `false`

---

## 4. Webhook (opcjonalnie później)

Settings → Webhooks → Add webhook:
- **URL:** Vercel Deploy Hook URL
- **Triggers:** Entry/Asset → Publish + Unpublish
- **Filter:** content type IN `trip, country, region, siteSettings`

---

## 5. Po skończeniu

```bash
npm run dev
```

Otwórz http://localhost:4321 — powinno pokazać dane z Contentful zamiast fallback.

Verify:
- Homepage: hero title "w drodze przez", 23 kraje, 147 dni
- `/podroze/mestia-trekking` — full content
- `/gruzja/swaneti` — region page
- `/mapa` — 3 piny

Jeśli coś nie działa: `node scripts/inspect.mjs` pokaże ile entries jest w każdym content type.
