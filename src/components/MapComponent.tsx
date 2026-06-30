import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { POI } from "../types";
import { AppLanguage } from "../i18n/language";
import { MapPin, Plus, Minus, Navigation } from "lucide-react";
import MapPoiPopup from "./MapPoiPopup";
import {
  getGoogleMapsApiKey,
  getGoogleMapId,
  hasGoogleMapsApiKey,
} from "../config/googleMaps";

interface MapComponentProps {
  pois: POI[];
  selectedPoi: POI | null;
  onSelectPoi: (poi: POI) => void;
  onExplorePoi?: (poi: POI) => void;
  onClosePoi?: () => void;
  language: AppLanguage;
}

const API_KEY = getGoogleMapsApiKey();
const MAP_ID = getGoogleMapId();
const hasValidKey = hasGoogleMapsApiKey();

export default function MapComponent({
  pois,
  selectedPoi,
  onSelectPoi,
  onExplorePoi,
  onClosePoi,
  language,
}: MapComponentProps) {
  const [mapType, setMapType] = useState<"standard" | "satellite" | "terrain">("standard");
  const [zoom, setZoom] = useState(12);
  const userLocation = { lat: 49.1794, lng: 13.1822 };
  const [mapCenter, setMapCenter] = useState({ lat: 49.1794, lng: 13.1822 });

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const lastSelectedPoiId = useRef<string | null>(null);

  // Pan to POI only when selection changes — don't lock the map on zoom
  useEffect(() => {
    if (!selectedPoi) {
      lastSelectedPoiId.current = null;
      return;
    }
    if (selectedPoi.id === lastSelectedPoiId.current) return;

    lastSelectedPoiId.current = selectedPoi.id;
    setMapCenter({ lat: selectedPoi.lat, lng: selectedPoi.lng });

    const latDiff = selectedPoi.lat - 49.1794;
    const lngDiff = selectedPoi.lng - 13.1822;
    setDragOffset({
      x: -lngDiff * 1500 * (zoom / 12),
      y: latDiff * 1500 * (zoom / 12),
    });
  }, [selectedPoi, zoom]);

  const handleCameraChanged = useCallback((ev: MapCameraChangedEvent) => {
    setMapCenter(ev.detail.center);
    setZoom(ev.detail.zoom);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 8));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const getSimulatedPosition = (lat: number, lng: number) => {
    const refLat = 49.1794;
    const refLng = 13.1822;
    const scale = 1400 * (zoom / 12);
    return {
      x: (lng - refLng) * scale + dragOffset.x + 300,
      y: -(lat - refLat) * scale + dragOffset.y + 250,
    };
  };

  const currentMapBg = () => {
    if (mapType === "satellite") return "bg-[#0b1329] opacity-90 transition-all duration-300";
    if (mapType === "terrain") return "bg-[#0f1d1a] opacity-95 transition-all duration-300";
    return "bg-[#0f172a] transition-all duration-300";
  };

  const handleOpenDetails = (poi: POI) => {
    (onExplorePoi ?? onSelectPoi)(poi);
  };

  const handleClosePopup = () => {
    onClosePoi?.();
  };

  const popupProps = selectedPoi
    ? {
        poi: selectedPoi,
        language,
        userLat: userLocation.lat,
        userLng: userLocation.lng,
        onClose: handleClosePopup,
        onOpenDetails: () => handleOpenDetails(selectedPoi),
      }
    : null;

  return (
    <div className="relative h-[min(600px,70vh)] min-h-[320px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[600px] sm:min-h-0">
      {hasValidKey ? (
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            center={mapCenter}
            zoom={zoom}
            mapId={MAP_ID}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            style={{ width: "100%", height: "100%" }}
            mapTypeId={
              mapType === "satellite"
                ? "satellite"
                : mapType === "terrain"
                  ? "terrain"
                  : "roadmap"
            }
            disableDefaultUI={true}
            clickableIcons={false}
            gestureHandling="greedy"
            onCameraChanged={handleCameraChanged}
          >
            {pois.map((poi) => {
              const isSelected = selectedPoi?.id === poi.id;
              return (
                <AdvancedMarker
                  key={poi.id}
                  position={{ lat: poi.lat, lng: poi.lng }}
                  onClick={() => onSelectPoi(poi)}
                >
                  <div className="group flex cursor-pointer flex-col items-center">
                    <div
                      className={`transform rounded-full border p-2 shadow-lg transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-300 ring-4 ring-emerald-500/30"
                          : "border-emerald-400 bg-emerald-600 group-hover:bg-emerald-500"
                      }`}
                    >
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            <AdvancedMarker position={userLocation}>
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-blue-500/30" />
                <div className="rounded-full border border-blue-400 bg-blue-600 p-2.5 shadow-xl">
                  <Navigation className="h-4 w-4 rotate-45 transform text-white" />
                </div>
              </div>
            </AdvancedMarker>
          </Map>
        </APIProvider>
      ) : (
        <div
          id="mock-map-canvas"
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative h-full w-full cursor-grab select-none overflow-hidden ${currentMapBg()} ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          style={{
            backgroundImage:
              mapType === "standard"
                ? "radial-gradient(#334155 1.5px, transparent 1.5px)"
                : mapType === "terrain"
                  ? "linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)"
                  : "radial-gradient(rgba(244, 63, 94, 0.1) 1.5px, transparent 1.5px)",
            backgroundSize: mapType === "terrain" ? "30px 30px" : "40px 40px",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <svg className="absolute inset-0 h-full w-full">
              <path
                d="M -500 300 Q 200 150 800 600 T 1800 400"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
            </svg>
          </div>

          {(() => {
            const pos = getSimulatedPosition(userLocation.lat, userLocation.lng);
            return (
              <div
                style={{ left: pos.x, top: pos.y }}
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 transform"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-emerald-500/30" />
                  <div className="rounded-full border border-emerald-400 bg-emerald-600 p-2.5 shadow-2xl">
                    <Navigation className="h-4 w-4 rotate-45 transform animate-pulse text-white" />
                  </div>
                </div>
              </div>
            );
          })()}

          {pois.map((poi) => {
            const pos = getSimulatedPosition(poi.lat, poi.lng);
            const isSelected = selectedPoi?.id === poi.id;
            if (pos.x < -100 || pos.x > 1500 || pos.y < -100 || pos.y > 800) return null;

            return (
              <div
                key={poi.id}
                style={{ left: pos.x, top: pos.y }}
                className="absolute z-20 -translate-x-1/2 -translate-y-full transform"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPoi(poi);
                  }}
                  className="group flex cursor-pointer flex-col items-center focus:outline-none"
                >
                  <div
                    className={`transform rounded-full border p-2.5 shadow-xl transition-all duration-300 group-hover:scale-110 ${
                      isSelected
                        ? "scale-110 border-emerald-300 bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                        : "border-slate-200 bg-white text-emerald-600 hover:border-emerald-500 shadow-sm"
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                </button>
              </div>
            );
          })}

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 font-mono text-[10px] text-slate-500 shadow-sm">
            <span>Scale: 1 : 50,000</span>
            <span className="inline-block h-px w-8 bg-slate-600" />
            <span>200m</span>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="pointer-events-auto absolute right-4 top-4 z-40 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="rounded-lg bg-white p-2 text-slate-700 shadow-md transition-colors hover:bg-slate-100"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="rounded-lg bg-white p-2 text-slate-700 shadow-md transition-colors hover:bg-slate-100"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Map type selector */}
      <div className="pointer-events-auto absolute bottom-4 right-4 z-40 flex gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md">
        {(["standard", "satellite", "terrain"] as const).map((type) => (
          <button
            key={type}
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

      {/* Bottom info card — does not block map panning */}
      {popupProps && (
        <div className="pointer-events-none absolute inset-x-0 bottom-14 z-40 flex justify-center px-4">
          <MapPoiPopup {...popupProps} />
        </div>
      )}
    </div>
  );
}
