import { useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ChevronRight, Navigation } from "lucide-react";
import { POI } from "../types";
import { AppLanguage, getPoiName, tr } from "../i18n/language";
import NavigationMap from "./NavigationMap";
import {
  getGoogleMapsApiKey,
  hasGoogleMapsApiKey,
} from "../config/googleMaps";

interface NavigateViewProps {
  poi: POI;
  language: AppLanguage;
  onBackToDetails: () => void;
}

function readSavedLocation(): { lat: number; lng: number } | null {
  try {
    const saved = localStorage.getItem("userLocation");
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return null;
}

export default function NavigateView({
  poi,
  language,
  onBackToDetails,
}: NavigateViewProps) {
  const txt = (en: string, de: string, cs: string) => tr(language, en, de, cs);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      const fallback = readSavedLocation() ?? { lat: 49.3955, lng: 13.2952 };
      setOrigin(fallback);
      setGeoError(
        txt(
          "Geolocation unavailable — using last known position.",
          "Geolokation nicht verfügbar — letzte bekannte Position wird verwendet.",
          "Geolokace není k dispozici — používá se poslední známá poloha."
        )
      );
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOrigin(loc);
        localStorage.setItem("userLocation", JSON.stringify(loc));
        setGeoLoading(false);
      },
      () => {
        const fallback = readSavedLocation() ?? { lat: 49.3955, lng: 13.2952 };
        setOrigin(fallback);
        setGeoError(
          txt(
            "Could not access GPS — using approximate starting point.",
            "GPS nicht verfügbar — ungefährer Startpunkt wird verwendet.",
            "GPS nelze získat — používá se přibližný výchozí bod."
          )
        );
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [language]);

  const poiName = getPoiName(poi, language);

  return (
    <div className="animate-fade-in space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBackToDetails}
            className="mb-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            {txt("Back to destination", "Zurück zum Ziel", "Zpět na detail cíle")}
          </button>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900">
            {txt("Trail Navigation", "Wegnavigation", "Navigace na stezku")}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {txt(
              `Walking route to ${poiName} from your current location.`,
              `Fußweg zu ${poiName} von Ihrem Standort.`,
              `Pěší trasa k ${poiName} z vaší aktuální polohy.`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
          <Navigation className="h-4 w-4 text-emerald-600" />
          <span className="font-mono">
            {poi.lat.toFixed(4)}, {poi.lng.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="h-[min(600px,70vh)] min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {hasGoogleMapsApiKey() ? (
          <APIProvider apiKey={getGoogleMapsApiKey()} version="weekly">
            <NavigationMap
              poi={poi}
              origin={origin}
              language={language}
              geoLoading={geoLoading}
              geoError={geoError}
            />
          </APIProvider>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-sm text-slate-500">
              {txt(
                "Google Maps API key required for in-app navigation.",
                "Google Maps API-Schlüssel für In-App-Navigation erforderlich.",
                "Pro navigaci v aplikaci je potřeba Google Maps API klíč."
              )}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}&travelmode=walking`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase text-white hover:bg-emerald-500"
            >
              {txt("Open in Google Maps", "In Google Maps öffnen", "Otevřít v Google Maps")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
