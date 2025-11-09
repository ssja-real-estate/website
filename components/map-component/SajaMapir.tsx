// components/map-component/SajaMapir.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import maplibregl, { Map as MLMap, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSetRecoilState } from "recoil";
import { mapClickState } from "../../global/states/mapClickStates";
import type MapInfo from "../../global/types/MapInfo";
import type { Estate } from "../../global/types/Estate";
import { useRouter } from "next/router";
import type { Feature, FeatureCollection, Point } from "geojson";

const MAPIR_API_KEY = process.env.NEXT_PUBLIC_MAPIR_KEY || "";
const STYLE_URL = "https://map.ir/vector/styles/main/mapir-xyz-style.json";

if (typeof window !== "undefined" && (maplibregl as any).setRTLTextPlugin) {
  const anyGL = maplibregl as any;
  if (!anyGL.__rtl_inited__) {
    anyGL.__rtl_inited__ = true;
    maplibregl.setRTLTextPlugin(
      "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.js",
      false
    );
  }
}

type Props = {
  coordinate: MapInfo;
  isDragable: boolean;
  estates?: Estate[]; // لیست املاک که از سرور می‌آید
};

const ZOOM_THRESHOLD_SHOW_REGION = 13;

type EstateFeature = Feature<Point, {
  id: string;
  title: string;
  address: string;
  image?: string | null;
}>;

const SsjaMapIr: FC<Props> = ({ coordinate, isDragable, estates }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const centerMarkerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const router = useRouter();
  const setMapClick = useSetRecoilState(mapClickState);
  const countControlRef = useRef<HTMLDivElement | null>(null);

  const escapeHtml = (unsafe: any) => {
    if (unsafe === null || unsafe === undefined) return "";
    return String(unsafe)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  // تبدیل و فیلتر املاک: فقط املاکی که lat/lng معتبر دارند را تبدیل کن
  const buildGeoJSON = (arr: Estate[] | undefined): FeatureCollection<Point, Record<string, any>> => {
    const raw = arr || [];
    console.debug("[SajaMapIr] Estates received:", raw.length);
    const features: EstateFeature[] = raw
      .map((est) => {
        const lat = Number(est?.mapInfo?.latitude);
        const lng = Number(est?.mapInfo?.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        let firstImage: string | null = null;
        try {
          const imgField = est?.dataForm?.fields?.find((f: any) => f.type === 5);
          if (imgField && Array.isArray(imgField.value) && imgField.value.length > 0) {
            firstImage = `https://ssja.ir/api/images/${est.id}/${imgField.value[0]}`;
          }
        } catch (e) {
          firstImage = null;
        }

        const title = est?.dataForm?.title || "";
        const addr = est?.address || "";

        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [lng, lat],
          },
          properties: {
            id: est.id,
            title,
            address: addr,
            image: firstImage,
          },
        } as EstateFeature;
      })
      .filter((f): f is EstateFeature => f !== null);

    console.debug("[SajaMapIr] Valid features prepared:", features.length);

    return {
      type: "FeatureCollection" as const,
      features,
    };
  };

  const inBounds = (lat: number, lng: number, bounds: maplibregl.LngLatBounds) => {
    return (
      lat >= bounds.getSouth() &&
      lat <= bounds.getNorth() &&
      lng >= bounds.getWest() &&
      lng <= bounds.getEast()
    );
  };

  // ساخت و پیکربندی نقشه
  useEffect(() => {
    if (!MAPIR_API_KEY) {
      console.error("MapIR API Key is missing.");
      return;
    }
    if (mapRef.current || !mapContainer.current) return;

    let cancelled = false;

    (async () => {
      try {
        const styleRes = await fetch(STYLE_URL, {
          headers: { "x-api-key": MAPIR_API_KEY, Accept: "application/json" },
          cache: "no-store",
        });
        if (!styleRes.ok) throw new Error(`Failed to load style: ${styleRes.status}`);
        const styleJson = (await styleRes.json()) as StyleSpecification;

        if (Array.isArray(styleJson.layers)) {
          styleJson.layers = styleJson.layers.map((ly: any) => {
            if (ly.type === "symbol" && ly.layout && ly.layout["text-field"]) {
              ly.layout["text-field"] = [
                "coalesce",
                ["get", "name:fa"],
                ["get", "name:ar"],
                ["get", "name"],
              ];
            }
            return ly;
          });
        }

        if (cancelled) return;

        const map = new MLMap({
          container: mapContainer.current!,
          style: styleJson,
          center: [coordinate.longitude, coordinate.latitude],
          zoom: coordinate.zoom,
          transformRequest: (url) =>
            url.includes("map.ir")
              ? { url, headers: { "x-api-key": MAPIR_API_KEY } }
              : { url },
        });

        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl(), "top-left");

        // کنترل شمارندهٔ املاک (نمایش در بالا-راست)
        const infoDiv = document.createElement("div");
        infoDiv.className = "mapboxgl-ctrl my-estate-count";
        infoDiv.style.cssText =
          "background:white;padding:6px 10px;border-radius:6px;margin:8px;font-size:13px;box-shadow:0 1px 4px rgba(0,0,0,0.15)";
        infoDiv.innerText = "املاک: 0";
        countControlRef.current = infoDiv;
        const control: any = {
          onAdd: () => infoDiv,
          onRemove: () => {
            infoDiv.parentNode?.removeChild(infoDiv);
          },
        };
        map.addControl(control, "top-right");

        // marker مرکزی
        centerMarkerRef.current = new maplibregl.Marker({ draggable: isDragable })
          .setLngLat([coordinate.longitude, coordinate.latitude])
          .addTo(map);

        const updatePosition = (lngLat: maplibregl.LngLat) => {
          const { lng, lat } = lngLat;
          setMapClick({ lat: +lat.toFixed(6), lng: +lng.toFixed(6) });
        };

        map.on("click", (e) => {
          centerMarkerRef.current?.setLngLat(e.lngLat);
          updatePosition(e.lngLat);
        });

        centerMarkerRef.current.on("dragend", () => {
          const lngLat = centerMarkerRef.current?.getLngLat();
          if (lngLat) updatePosition(lngLat);
        });

        map.on("load", () => {
          // منبع با clustering
          map.addSource("estates", {
            type: "geojson",
            data: buildGeoJSON(estates),
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "estates",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                10,
                "#f1f075",
                30,
                "#f28cb1",
              ],
              "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            },
          });

          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "estates",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Noto Naskh Arabic Regular", "Arial Unicode MS Bold"],
              "text-size": 12,
            },
            paint: {
              "text-color": "#000",
            },
          });

          map.addLayer({
            id: "unclustered-point",
            type: "circle",
            source: "estates",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#D9534F",
              "circle-radius": 8,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            },
          });

          map.on("mouseenter", "unclustered-point", (e) => {
            map.getCanvas().style.cursor = "pointer";
            if (!e.features || !e.features.length) return;
            const f = e.features[0];
            const props = (f.properties as any) || {};
            const coords = (f.geometry as any).coordinates.slice();
            const title = escapeHtml(props.title);
            const addr = escapeHtml(props.address);
            const img = props.image ? escapeHtml(props.image) : null;

            const html = `
              <div style="min-width:220px;">
                <div style="font-weight:700;margin-bottom:6px;">${title}</div>
                ${img ? `<div style="margin-bottom:6px;"><img src="${img}" style="width:100%;height:100px;object-fit:cover;border-radius:6px" /></div>` : ""}
                <div style="font-size:13px;color:#333;margin-bottom:6px;line-height:1.2">${addr}</div>
                <div style="font-size:13px;"><a href="/estate/${escapeHtml(props.id)}" style="color:#0b74ff;text-decoration:underline">نمایش جزئیات</a></div>
              </div>
            `;
            popupRef.current?.remove();
            popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
              .setLngLat(coords)
              .setHTML(html)
              .addTo(map);
          });

          map.on("mouseleave", "unclustered-point", () => {
            map.getCanvas().style.cursor = "";
            popupRef.current?.remove();
            popupRef.current = null;
          });

          map.on("click", "unclustered-point", (e) => {
            if (!e.features || !e.features.length) return;
            const props = (e.features[0].properties as any) || {};
            const id = props.id;
            if (id) {
              router.push(`/estate/${id}`);
            }
          });

          map.on("click", "clusters", (e) => {
            if (!e.features || !e.features.length) return;
            const clusterId = (e.features[0].properties as any).cluster_id;
            const source: any = map.getSource("estates");
            if (source && source.getClusterExpansionZoom) {
              source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                if (err) return;
                const coords = (e.features![0].geometry as any).coordinates;
                map.easeTo({ center: coords, zoom });
              });
            }
          });

          map.on("mouseenter", "clusters", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "clusters", () => {
            map.getCanvas().style.cursor = "";
          });
        });
      } catch (e) {
        console.error("Map initialization error:", e);
      }
    })();

    return () => {
      popupRef.current?.remove();
      centerMarkerRef.current?.remove();
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {}
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // مانور هنگام تغییر coordinate
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [coordinate.longitude, coordinate.latitude],
      zoom: coordinate.zoom,
      essential: true,
    });
    centerMarkerRef.current?.setLngLat([coordinate.longitude, coordinate.latitude]);
  }, [coordinate.latitude, coordinate.longitude, coordinate.zoom]);

  useEffect(() => {
    centerMarkerRef.current?.setDraggable(!!isDragable);
  }, [isDragable]);

  // به‌روز‌رسانی source بر اساس estates و bounds/zoom
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSourceData = (arr: Estate[] | undefined) => {
      const src = map.getSource("estates") as maplibregl.GeoJSONSource | undefined;
      if (!src) return;
      const fc = buildGeoJSON(arr || []);
      try {
        src.setData(fc);
        console.debug("[SajaMapIr] Source set with", fc.features.length, "features");
        if (countControlRef.current) {
          countControlRef.current.innerText = `املاک: ${fc.features.length}`;
        }
        // اگر فیچر داریم و در زوم پایین هستیم، می‌تونیم به باند فیچرها فیت کنیم (اختیاری)
        // اگر خواستی این رفتار را فعال کنم بگو
      } catch (e) {
        console.warn("setData error:", e);
      }
    };

    const handleMoveEnd = () => {
      const z = map.getZoom();
      if (z >= ZOOM_THRESHOLD_SHOW_REGION) {
        const bounds = map.getBounds();
        const visible = (estates || []).filter(
          (est) =>
            est?.mapInfo?.latitude !== undefined &&
            est?.mapInfo?.longitude !== undefined &&
            inBounds(est.mapInfo.latitude, est.mapInfo.longitude, bounds)
        );
        updateSourceData(visible);
      } else {
        updateSourceData(estates);
      }
    };

    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd);
    handleMoveEnd();

    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
    };
  }, [estates]);

  return <div ref={mapContainer} className="w-full h-full" style={{ direction: "rtl" }} />;
};

export default SsjaMapIr;
