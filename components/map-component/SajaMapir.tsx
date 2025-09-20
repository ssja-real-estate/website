"use client";

import { FC, useEffect, useRef } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";
import type MapInfo from "../../global/types/MapInfo";

const MAPIR_API_KEY = process.env.NEXT_PUBLIC_MAPIR_KEY || "";
const STYLE_URL = "https://map.ir/vector/styles/main/mapir-xyz-style.json";

type Props = { coordinate: MapInfo; isDragable: boolean };

const SsjaMapIr: FC<Props> = ({ coordinate, isDragable }) => {
  // +++ لاگ برای دیباگ کردن کلید API +++
  // این لاگ در کنسول مرورگر نمایش داده می‌شود و به ما نشان می‌دهد
  // که آیا کلید API به درستی در زمان بیلد به کد تزریق شده است یا خیر.
  console.log("Map Component Rendered. API Key is:", MAPIR_API_KEY);
  // +++++++++++++++++++++++++++++++++++++

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const setMapClick = useSetRecoilState(mapClickState);

  // Effect for initializing the map
  useEffect(() => {
    // یک بررسی اضافه می‌کنیم که اگر کلید وجود نداشت، نقشه را اصلا مقداردهی اولیه نکند
    if (!MAPIR_API_KEY) {
      console.error("MapIR API Key is missing. The map cannot be initialized.");
      return;
    }
    if (mapRef.current || !mapContainer.current) return; // Initialize map only once

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

    // Initialize marker
    markerRef.current = new maplibregl.Marker({ draggable: isDragable })
      .setLngLat([coordinate.longitude, coordinate.latitude])
      .addTo(map);

    const updatePosition = (lngLat: maplibregl.LngLat) => {
      const { lng, lat } = lngLat;
      setMapClick({ lat: +lat.toFixed(6), lng: +lng.toFixed(6) });
    };

    // Event listeners
    map.on("click", (e) => {
      markerRef.current?.setLngLat(e.lngLat);
      updatePosition(e.lngLat);
    });

    markerRef.current.on("dragend", () => {
      const lngLat = markerRef.current?.getLngLat();
      if (lngLat) {
        updatePosition(lngLat);
      }
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  // Effect for updating map center when coordinate prop changes
  useEffect(() => {
    mapRef.current?.flyTo({
      center: [coordinate.longitude, coordinate.latitude],
      zoom: coordinate.zoom,
    });
    markerRef.current?.setLngLat([coordinate.longitude, coordinate.latitude]);
  }, [coordinate]);

  // Effect for updating marker's draggability
  useEffect(() => {
    markerRef.current?.setDraggable(isDragable);
  }, [isDragable]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default SsjaMapIr;
