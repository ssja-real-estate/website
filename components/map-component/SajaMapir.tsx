// components/map-component/SsjaMapIr.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import maplibregl, { Map as MLMap, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";
import type MapInfo from "../../global/types/MapInfo";

const MAPIR_API_KEY = process.env.NEXT_PUBLIC_MAPIR_KEY || "";
const STYLE_URL = "https://map.ir/vector/styles/main/mapir-xyz-style.json";

// --- باید پیش از ساخت نقشه لود شود (و بهتره lazy نباشد) ---
if (typeof window !== "undefined" && (maplibregl as any).setRTLTextPlugin) {
  const anyGL = maplibregl as any;
  if (!anyGL.__rtl_inited__) {
    anyGL.__rtl_inited__ = true;
    maplibregl.setRTLTextPlugin(
      "https://cdn.maptiler.com/maplibre-gl-rtl-text/latest/maplibre-gl-rtl-text.js",
   
      false // ← اجباری لود شود تا لیبل‌ها حتماً نشان داده شوند
    );
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

    let cancelled = false;

    (async () => {
      try {
        // 1) استایل را خودمان با هدر می‌گیریم تا 401/403 نخوریم
        const styleRes = await fetch(STYLE_URL, {
          headers: { "x-api-key": MAPIR_API_KEY, Accept: "application/json" },
          cache: "no-store",
        });
        if (!styleRes.ok) throw new Error(`Failed to load style: ${styleRes.status}`);
        const styleJson = (await styleRes.json()) as StyleSpecification;
        if (cancelled) return;

        // 2) نقشه
        const map = new MLMap({
          container: mapContainer.current!,
          style: styleJson, // ← استایلِ آبجکت، نه URL
          center: [coordinate.longitude, coordinate.latitude],
          zoom: coordinate.zoom,
          // برای tiles/glyphs/sprites هم هدر را بفرست
          transformRequest: (url) =>
            url.includes("map.ir")
              ? { url, headers: { "x-api-key": MAPIR_API_KEY } }
              : { url },
        });
        mapRef.current = map;

        // 3) کنترل‌ها
        map.addControl(new maplibregl.NavigationControl(), "top-left");

        // 4) مارکر
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

        // برای دیباگ خطاهای شبکه/استایل (مثلاً glyphs 403)
        map.on("error", (ev) => {
          // @ts-ignore
          const err = ev?.error;
          if (err) console.error("Map error:", err);
        });
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      mapRef.current?.remove();
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
