/**
 * Resolves the Google Maps JavaScript API key from Vite env variables.
 * Set any one of these in your `.env` file (restart dev server after changes):
 *   VITE_GOOGLE_MAPS_API_KEY=your_key
 *   GOOGLE_API_KEY=your_key
 *   GOOGLE_MAPS_PLATFORM_KEY=your_key
 */
export function getGoogleMapsApiKey(): string {
  const key =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    import.meta.env.GOOGLE_API_KEY ||
    import.meta.env.GOOGLE_MAPS_PLATFORM_KEY ||
    "";

  return key.trim();
}

export function getGoogleMapId(): string {
  return (
    import.meta.env.VITE_GOOGLE_MAP_ID?.trim() || "DEMO_MAP_ID"
  );
}

export function hasGoogleMapsApiKey(): boolean {
  const key = getGoogleMapsApiKey();
  return Boolean(key) && key !== "YOUR_API_KEY";
}
     