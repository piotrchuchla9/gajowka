/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_ACCESS_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
  readonly CONTENTFUL_ENVIRONMENT: string;
  readonly PUBLIC_MAPTILER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
