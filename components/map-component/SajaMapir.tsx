// components/map-component/SsjaMapIr.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";
import type MapInfo from "../../global/types/MapInfo";

const MAPIR_API_KEY = process.env.NEXT_PUBLIC_MAPIR_KEY??"";
const STYLE_URL = "https://map.ir/vector/styles/main/mapir-xyz-style.json";



type Props = { cordinate: MapInfo; isDragable: boolean };

const SsjaMapIr: FC<Props> = ({ cordinate, isDragable }) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const setMapClick = useSetRecoilState(mapClickState);

  async function reverseGeocode(lat: number, lon: number) {
    const res = await fetch(`https://map.ir/reverse?lat=${lat}&lon=${lon}`, {
      headers: { "x-api-key": MAPIR_API_KEY, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("reverse failed");
    return (res.json() as Promise<{
      address?: string;
      province?: string;
      city?: string;
      region?: string;       // منطقه شهرداری
      neighborhood?: string; // محله
    }>);
  }

  useEffect(() => {
    const node = mapNode.current;
    if (!node || mapRef.current) return;

    const map = new MLMap({
      container: node,
      style: STYLE_URL,
      center: [cordinate.longitude, cordinate.latitude],
      zoom: cordinate.zoom,
      transformRequest: (url) =>
        url.includes("map.ir")
          ? { url, headers: { "x-api-key": MAPIR_API_KEY } }
          : { url },
    });
    mapRef.current = map;

    // کنترل‌ها
    map.addControl(new maplibregl.NavigationControl(), "top-left");

    // مارکر اولیه
    markerRef.current = new maplibregl.Marker({ draggable: isDragable })
      .setLngLat([cordinate.longitude, cordinate.latitude])
      .addTo(map);

    const showPopup = (lng: number, lat: number, title: string, address?: string) => {
      // فقط یک پاپ‌آپ فعال نگه داریم
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ offset: 10, closeButton: true })
        .setLngLat([lng, lat])
        .setHTML(
          `<div style="direction:rtl; font-size:12px; line-height:1.6">
              <strong>${title}</strong><br/>${address || ""}
           </div>`
        )
        .addTo(map);
    };

    // کلیک: ست مختصات + پاپ‌آپ
    const handleClick = async (e: maplibregl.MapMouseEvent) => {
      const lng = +e.lngLat.lng.toFixed(6);
      const lat = +e.lngLat.lat.toFixed(6);

      markerRef.current?.setLngLat([lng, lat]);
      setMapClick({ lat, lng });

      try {
        const r = await reverseGeocode(lat, lng);
        const title =
          [r.province, r.city, r.neighborhood || r.region].filter(Boolean).join(" / ") ||
          "نام منطقه نامشخص";
        showPopup(lng, lat, title, r.address);
      } catch (err) {
        console.error(err);
      }
    };

    map.on("click", handleClick);

    // درگ مارکر
    const handleDragEnd = async () => {
      const pos = markerRef.current?.getLngLat();
      if (!pos) return;
      const lng = +pos.lng.toFixed(6);
      const lat = +pos.lat.toFixed(6);
      setMapClick({ lat, lng });

      try {
        const r = await reverseGeocode(lat, lng);
        const title =
          [r.province, r.city, r.neighborhood || r.region].filter(Boolean).join(" / ") ||
          "نام منطقه نامشخص";
        showPopup(lng, lat, title, r.address);
      } catch (err) {
        console.error(err);
      }
    };
    markerRef.current?.on("dragend", handleDragEnd);

    // پاکسازی
    return () => {
      markerRef.current?.off("dragend", handleDragEnd);
      map.off("click", handleClick);
      popupRef.current?.remove();
      markerRef.current?.remove();
      map.remove();
      popupRef.current = null;
      markerRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // واکنش به تغییر ورودی مرکز/بزرگنمایی
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [cordinate.longitude, cordinate.latitude],
      zoom: cordinate.zoom,
      essential: true,
    });
    markerRef.current?.setLngLat([cordinate.longitude, cordinate.latitude]);
  }, [cordinate.longitude, cordinate.latitude, cordinate.zoom]);

  // فعال/غیرفعال کردن درگ مارکر
  useEffect(() => {
    markerRef.current?.setDraggable(!!isDragable);
  }, [isDragable]);

  return (
    <div
      ref={mapNode}
      className="w-full h-full"
      style={{ cursor: "crosshair", direction: "rtl" }}
    />
  );
};

export default SsjaMapIr;
