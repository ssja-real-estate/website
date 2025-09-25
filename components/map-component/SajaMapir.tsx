// components/map-component/SsjaMapIr.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";
import type MapInfo from "../../global/types/MapInfo";

const MAPIR_API_KEY = process.env.NEXT_PUBLIC_MAPIR_KEY || "";
const STYLE_URL = "https://map.ir/vector/styles/main/mapir-xyz-style.json";

// --- مهم: فعال‌کردن شکل‌دهی متن RTL برای فارسی/عربی ---
if (typeof window !== "undefined" && (maplibregl as any).setRTLTextPlugin) {
  try {
    // فقط یک‌بار لود شود
    const anyGL = maplibregl as any;
    if (!anyGL.__rtl_loaded__) {
      anyGL.__rtl_loaded__ = true;
      maplibregl.setRTLTextPlugin(
        "https://cdn.maptiler.com/maplibre-gl-rtl-text/latest/maplibre-gl-rtl-text.js",
 
        true // lazy-load
      );
    }
  } catch (e) {
    console.error("Failed to init RTL plugin:", e);
  }
}

type Props = { coordinate: MapInfo; isDragable: boolean };

const SsjaMapIr: FC<Props> = ({ coordinate, isDragable }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const setMapClick = useSetRecoilState(mapClickState);

  useEffect(() => {
    if (!MAPIR_API_KEY) {
      console.error("MapIR API Key is missing. The map cannot be initialized.");
      return;
    }
    if (mapRef.current || !mapContainer.current) return;

    const map = new MLMap({
      container: mapContainer.current,
      style: STYLE_URL,
      center: [coordinate.longitude, coordinate.latitude],
      zoom: coordinate.zoom,
      transformRequest: (url) =>
        url.includes("map.ir")
          ? { url, headers: { "x-api-key": MAPIR_API_KEY } }
          : { url },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-left");

    markerRef.current = new maplibregl.Marker({ draggable: isDragable })
      .setLngLat([coordinate.longitude, coordinate.latitude])
      .addTo(map);

    const updatePosition = (lngLat: maplibregl.LngLat) => {
      const { lng, lat } = lngLat;
      setMapClick({ lat: +lat.toFixed(6), lng: +lng.toFixed(6) });
    };

    map.on("click", (e) => {
      markerRef.current?.setLngLat(e.lngLat);
      updatePosition(e.lngLat);
    });

    markerRef.current.on("dragend", () => {
      const lngLat = markerRef.current?.getLngLat();
      if (lngLat) updatePosition(lngLat);
    });

    return () => {
      markerRef.current?.remove();
      map.remove();
      markerRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [coordinate.longitude, coordinate.latitude],
      zoom: coordinate.zoom,
      essential: true,
    });
    markerRef.current?.setLngLat([coordinate.longitude, coordinate.latitude]);
  }, [coordinate]);

  useEffect(() => {
    markerRef.current?.setDraggable(!!isDragable);
  }, [isDragable]);

  return <div ref={mapContainer} className="w-full h-full" style={{ direction: "rtl" }} />;
};

export default SsjaMapIr;
