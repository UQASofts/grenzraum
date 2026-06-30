/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_MAPS_PLATFORM_KEY?: string;
  readonly VITE_GOOGLE_MAP_ID?: string;
  readonly GOOGLE_API_KEY?: string;
  readonly GOOGLE_MAPS_PLATFORM_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
