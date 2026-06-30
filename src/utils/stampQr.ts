/** Public app URL encoded in destination QR codes for digital stamp collection. */
export function getStampCollectUrl(poiId: string, origin?: string): string {
  const configuredOrigin =
    typeof import.meta !== "undefined"
      ? import.meta.env.VITE_SITE_URL?.replace(/\/$/, "")
      : undefined;
  const base =
    origin ??
    configuredOrigin ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/?collect=${encodeURIComponent(poiId)}`;
}

export function getStampQrImageUrl(poiId: string, size = 320, origin?: string): string {
  const data = getStampCollectUrl(poiId, origin);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(data)}`;
}

export function slugifyPoiName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extract POI id from a scanned stamp check-in URL or raw query string. */
export function parseCollectPoiIdFromScan(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const fromQuery = url.searchParams.get("collect");
    if (fromQuery) return fromQuery;
  } catch {
    /* fall through */
  }

  const match = trimmed.match(/[?&]collect=([^&\s#]+)/i);
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return null;
}

export function stampCollectPath(poiId: string): string {
  return `/?collect=${encodeURIComponent(poiId)}`;
}
