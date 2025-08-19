import React, { FC, useRef, useEffect } from "react";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// اختیاری: برای آیکن‌ها
import * as BiIcon from "react-icons/bi";
import * as MdIcom from "react-icons/md";

// Recoil: اتم کلیک نقشه
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";


type Props = { lng: number; lat: number; zoom?: number };

const SsjaMap: FC<Props> = (props) => {
  const setMapClick = useSetRecoilState(mapClickState);

  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Helper اختیاری برای reverse-geocode و ساخت عنوان
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=fa,en`;
      const res = await fetch(url, { headers: { "User-Agent": "ssja/1.0" } });
      const data = await res.json();
      const a = data?.address || {};
      const province =
        a.state || a.province || a.region || a.county || "";
      const city =
        a.city || a.town || a.village || a.municipality || a.county || "";
      const hood =
        a.neighbourhood || a.suburb || a.city_district || a.district || a.quarter || "";
      return { province, city, hood };
    } catch {
      return { province: "", city: "", hood: "" };
    }
  };

  // Init map only once
  useEffect(() => {
    const node = mapNode.current;
    if (!node || typeof window === "undefined") return;
    if (!mapRef.current) {
      if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
        mapboxgl.setRTLTextPlugin(
          "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
          () => {},
          false
        );
      }

      mapboxgl.accessToken =
        "pk.eyJ1IjoiYW1hbmMiLCJhIjoiY2w2b3F2YTQ0MDVpdTNjcXB1OGtrd2g4ciJ9.8aU5BS_hrx4_vghgcgrptA";

      const map = new mapboxgl.Map({
        container: node,
        style: "mapbox://styles/mapbox/streets-v11",
        attributionControl: false,
        doubleClickZoom: true,
        center: [props.lng, props.lat],
        zoom: props.zoom ?? 5,
      });
      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // مارکر اولیه
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([props.lng, props.lat])
        .addTo(map);

      // یک پاپ‌آپ مشترک (اختیاری)
      popupRef.current = new mapboxgl.Popup({ offset: 10, closeButton: true });

      // کلیک روی نقشه
      const onClick = async (e: MapMouseEvent) => {
        const { lng, lat } = e.lngLat;

        // 1) جا‌به‌جا کردن مارکر
        markerRef.current?.setLngLat([lng, lat]);

        // 2) انتشار مختصات برای فرم (Recoil)
        setMapClick({ lat, lng });

        // 3) اختیاری: گرفتن نام منطقه و نمایش در پاپ‌آپ
        const info = await reverseGeocode(lat, lng);
        if (popupRef.current) {
          const title = [info.province, info.city, info.hood]
            .filter(Boolean)
            .join(" / ");
          popupRef.current
            .setLngLat([lng, lat])
            .setHTML(
              `<div style="direction: rtl; font-size: 12px;">
                ${title || "نام منطقه نامشخص"}
              </div>`
            )
            .addTo(map);
        }
      };

      map.on("click", onClick);

      // Cleanup
      return () => {
        map.off("click", onClick);
        popupRef.current?.remove();
        markerRef.current?.remove();
        map.remove();
        mapRef.current = null;
      };
    }
  }, []); // ← فقط یک‌بار

  // اگر props تغییر کرد، مرکز/مارکر آپدیت شود
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.flyTo({
      center: [props.lng, props.lat],
      zoom: props.zoom ?? mapRef.current.getZoom(),
      essential: true,
    });
    markerRef.current.setLngLat([props.lng, props.lat]);
  }, [props.lng, props.lat, props.zoom]);

  return (
    <div
      ref={mapNode}
      className="h-full w-full rounded-2xl shadow-lg border-[10px] border-white"
      style={{ cursor: "crosshair" }}
    />
  );
};

export default SsjaMap;
