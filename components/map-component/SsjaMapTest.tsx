import React, { FC, useRef, useEffect } from "react";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// اگر لازم است این‌ها را نگه دارید
import * as TbIcon from "react-icons/tb";
import * as BiIcon from "react-icons/bi";
import * as MdIcom from "react-icons/md";

import SearchSideBar from "./SearchSideBar";
import MapInfo from "../../global/types/MapInfo";

// Recoil: مختصات کلیک نقشه
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";


const SsjaMapTest: FC<{
  cordinate: MapInfo;
  isDragable: boolean;
}> = (props) => {
  const setMapClick = useSetRecoilState(mapClickState);

  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // ریورس‌جئوکد برای نمایش نام‌ها در پاپ‌آپ (اختیاری)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=fa,en`;
      const res = await fetch(url, { headers: { "User-Agent": "ssja/1.0" } });
      const data = await res.json();
      const a = data?.address || {};
      const province = a.state || a.province || a.region || a.county || "";
      const city =
        a.city || a.town || a.village || a.municipality || a.county || "";
      const hood =
        a.neighbourhood ||
        a.suburb ||
        a.city_district ||
        a.district ||
        a.quarter ||
        "";
      return { province, city, hood };
    } catch {
      return { province: "", city: "", hood: "" };
    }
  };

  // Init map only once
  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;
    if (mapRef.current) return; // جلوگیری از اینیت چندباره

    if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
        () => {},
        false
      );
    }

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYW1hbmMiLCJhIjoiY2w2b3F2YTQ0MDVpdTNjcXB1OGtrd2g4ciJ9.8aU5BS_hrx4_vghgcgrptA";

    const { longitude, latitude, zoom } = props.cordinate;

    const map = new mapboxgl.Map({
      attributionControl: false,
      container: node,
      style: "mapbox://styles/mapbox/streets-v11",
      doubleClickZoom: true,
      minZoom: 4,
      center: [longitude, latitude],
      zoom,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-left");

    // مارکر اولیه
    markerRef.current = new mapboxgl.Marker({ draggable: !!props.isDragable })
      .setLngLat([longitude, latitude])
      .addTo(map);

    // پاپ‌آپ مشترک
    popupRef.current = new mapboxgl.Popup({ offset: 10, closeButton: true });

    // کلیک روی نقشه: جابه‌جایی مارکر + ذخیره مختصات + نمایش نام‌ها
    const handleClick = async (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      markerRef.current?.setLngLat([lng, lat]);

      // انتشار مختصات برای فرم (SideBarForAddEstate)
      setMapClick({ lat, lng });

      // نمایش عنوان از ریورس‌جئوکد (اختیاری)
      const info = await reverseGeocode(lat, lng);
      if (popupRef.current) {
        const title = [info.province, info.city, info.hood]
          .filter(Boolean)
          .join(" / ");
        popupRef.current.setLngLat([lng, lat]).setHTML(
          `<div style="direction: rtl; font-size: 12px;">
             ${title || "نام منطقه نامشخص"}
           </div>`
        )
        .addTo(map);
      }
    };

    map.on("click", handleClick);

    // درگ مارکر (اگر فعال است): مثل کلیک نقشه عمل کند
    const handleDragEnd = async () => {
      const pos = markerRef.current?.getLngLat();
      if (!pos) return;
      const { lng, lat } = pos;
      setMapClick({ lat, lng });
      const info = await reverseGeocode(lat, lng);
      if (popupRef.current) {
        const title = [info.province, info.city, info.hood]
          .filter(Boolean)
          .join(" / ");
        popupRef.current.setLngLat([lng, lat]).setHTML(
          `<div style="direction: rtl; font-size: 12px;">
             ${title || "نام منطقه نامشخص"}
           </div>`
        )
        .addTo(map);
      }
    };

    markerRef.current?.on("dragend", handleDragEnd);

    // Cleanup
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

  // واکنش به تغییر مختصات ورودی (center/zoom جدید)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { longitude, latitude, zoom } = props.cordinate;
    map.flyTo({
      center: [longitude, latitude],
      zoom,
      essential: true,
    });
    markerRef.current?.setLngLat([longitude, latitude]);
  }, [props.cordinate.latitude, props.cordinate.longitude, props.cordinate.zoom]);

  // تغییر در قابلیت درگ مارکر
  useEffect(() => {
    markerRef.current?.setDraggable(!!props.isDragable);
  }, [props.isDragable]);

  return (
    <div
      className="w-full h-full"
      ref={mapNode}
      style={{ cursor: "crosshair" }}
    />
  );
};

export default SsjaMapTest;
