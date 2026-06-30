import { POI } from "../types";
import { MapPin, X, ChevronRight } from "lucide-react";
import { AppLanguage, getPoiName, getPoiSecondaryName, tr } from "../i18n/language";

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const CATEGORY_TAG: Record<POI["category"], { en: string; de: string; cs: string }> = {
  Lakes: { en: "Natural", de: "Natur", cs: "Příroda" },
  Waterfalls: { en: "Natural", de: "Natur", cs: "Příroda" },
  Hiking: { en: "Activity", de: "Aktivität", cs: "Aktivita" },
  Museums: { en: "Culture", de: "Kultur", cs: "Kultura" },
  "Secret Tips": { en: "Secret", de: "Geheim", cs: "Tajné" },
};

interface MapPoiPopupProps {
  poi: POI;
  language: AppLanguage;
  userLat: number;
  userLng: number;
  onClose: () => void;
  onOpenDetails: () => void;
}

export default function MapPoiPopup({
  poi,
  language,
  userLat,
  userLng,
  onClose,
  onOpenDetails,
}: MapPoiPopupProps) {
  const distance = getDistanceKm(userLat, userLng, poi.lat, poi.lng).toFixed(1);
  const tag = CATEGORY_TAG[poi.category];
  const title = getPoiName(poi, language);
  const subtitle = getPoiSecondaryName(poi, language);
  const txt = (en: string, de: string, cs: string) => tr(language, en, de, cs);

  return (
    <div className="pointer-events-auto flex w-full max-w-md items-stretch gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl">
      <img
        src={poi.image}
        alt={poi.name}
        className="h-16 w-16 shrink-0 rounded-lg object-cover border border-slate-200"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">{title}</h3>
            <p className="truncate text-[11px] text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label={txt("Close", "Schließen", "Zavřít")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500">
            <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 font-semibold uppercase tracking-wide text-emerald-700">
              {txt(tag.en, tag.de, tag.cs)}
            </span>
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {txt(`${distance} km away`, `${distance} km entfernt`, `${distance} km`)}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            className="flex shrink-0 items-center gap-0.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-emerald-500"
          >
            {txt("Details", "Details", "Detail")}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
