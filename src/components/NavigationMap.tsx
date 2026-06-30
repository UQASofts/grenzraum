import { useEffect, useRef, useState } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { POI } from "../types";
import { getGoogleMapId } from "../config/googleMaps";

interface DirectionsLayerProps {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onRouteReady?: (info: { distance: string; duration: string }) => void;
  onRouteError?: (message: string) => void;
}

function DirectionsLayer({
  origin,
  destination,
  onRouteReady,
  onRouteError,
}: DirectionsLayerProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const onRouteReadyRef = useRef(onRouteReady);
  const onRouteErrorRef = useRef(onRouteError);

  useEffect(() => {
    onRouteReadyRef.current = onRouteReady;
    onRouteErrorRef.current = onRouteError;
  }, [onRouteReady, onRouteError]);

  useEffect(() => {
    if (!map || !routesLibrary) return;

    const directionsService = new routesLibrary.DirectionsService();
    const directionsRenderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#10b981",
        strokeWeight: 5,
        strokeOpacity: 0.9,
      },
    });

    let cancelled = false;

    directionsService.route(
      {
        origin,
        destination,
        travelMode: routesLibrary.TravelMode.WALKING,
      },
      (result, status) => {
        if (cancelled) return;

        if (status === routesLibrary.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            onRouteReadyRef.current?.({
              distance: leg.distance?.text ?? "",
              duration: leg.duration?.text ?? "",
            });
          }
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(origin);
          bounds.extend(destination);
          map.fitBounds(bounds, 64);
        } else {
          onRouteErrorRef.current?.(
            status === routesLibrary.DirectionsStatus.ZERO_RESULTS
              ? "No walking route found between your location and this destination."
              : "Could not calculate route. Please try again."
          );
        }
      }
    );

    return () => {
      cancelled = true;
      directionsRenderer.setMap(null);
    };
  }, [map, routesLibrary, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

interface NavigationMapProps {
  poi: POI;
  origin: google.maps.LatLngLiteral | null;
  language: "en" | "cs";
  geoLoading: boolean;
  geoError: string | null;
}

export default function NavigationMap({
  poi,
  origin,
  language,
  geoLoading,
  geoError,
}: NavigationMapProps) {
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard");
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  const destination = { lat: poi.lat, lng: poi.lng };
  const mapCenter = origin ?? destination;

  return (
    <div className="relative h-full w-full">
      {(geoLoading || !origin) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center shadow-lg">
            <p className="text-sm font-semibold text-slate-900">
              {language === "en" ? "Locating you…" : "Zjišťuji polohu…"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {language === "en"
                ? "Allow location access to plot your route."
                : "Povolte přístup k poloze pro vykreslení trasy."}
            </p>
          </div>
        </div>
      )}

      {(geoError || routeError) && origin && (
        <div className="absolute left-4 right-4 top-4 z-50 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          {geoError || routeError}
        </div>
      )}

      {routeInfo && (
        <div className="absolute left-4 top-4 z-40 rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {language === "en" ? "Walking route" : "Pěší trasa"}
          </p>
          <p className="text-sm font-bold text-slate-900">
            {routeInfo.duration}
            <span className="mx-2 text-slate-600">•</span>
            {routeInfo.distance}
          </p>
        </div>
      )}

      <Map
        defaultCenter={mapCenter}
        defaultZoom={12}
        mapId={getGoogleMapId()}
        style={{ width: "100%", height: "100%" }}
        mapTypeId={
          mapType === "satellite" ? "satellite" : mapType === "terrain" ? "terrain" : "roadmap"
        }
        disableDefaultUI={true}
        clickableIcons={false}
        gestureHandling="greedy"
      >
        {origin && (
          <DirectionsLayer
            origin={origin}
            destination={destination}
            onRouteReady={setRouteInfo}
            onRouteError={setRouteError}
          />
        )}
      </Map>

      <div className="pointer-events-auto absolute bottom-4 right-4 z-40 flex gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md">
        {(["standard", "satellite", "terrain"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMapType(type)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize transition-all ${
              mapType === type
                ? "bg-emerald-600 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
