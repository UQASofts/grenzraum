import { MapPin } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import {
  getGoogleMapsApiKey,
  getGoogleMapId,
  hasGoogleMapsApiKey,
} from "../config/googleMaps";

interface PoiPreviewMapProps {
  lat: number;
  lng: number;
  className?: string;
}

function OsmStaticPreview({ lat, lng, className = "" }: PoiPreviewMapProps) {
  const src = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=12&size=640x288&maptype=mapnik&markers=${lat},${lng},lightgreen1`;

  return (
    <img
      src={src}
      alt=""
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

export default function PoiPreviewMap({ lat, lng, className = "" }: PoiPreviewMapProps) {
  const position = { lat, lng };

  if (!hasGoogleMapsApiKey()) {
    return <OsmStaticPreview lat={lat} lng={lng} className={className} />;
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <APIProvider apiKey={getGoogleMapsApiKey()} version="weekly">
        <Map
          defaultCenter={position}
          defaultZoom={13}
          mapId={getGoogleMapId()}
          style={{ width: "100%", height: "100%" }}
          disableDefaultUI
          clickableIcons={false}
          gestureHandling="none"
          keyboardShortcuts={false}
        >
          <AdvancedMarker position={position}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <span className="absolute inline-flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-ping rounded-full bg-emerald-500/40" />
                <div className="rounded-full border-2 border-white bg-emerald-600 p-1.5 shadow-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
