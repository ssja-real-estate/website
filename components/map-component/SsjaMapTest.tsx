import React, { FC, useRef, useEffect, useState } from "react";
import mapboxgl, {
  LngLat,
  LngLatLike,
  MapMouseEvent,
  NavigationControl,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as BiIcon from "react-icons/bi";
import * as MdIcom from "react-icons/md";
import SearchSideBar from "./SearchSideBar";

const SsjaMapTest: FC<{ lng: number; lat: number; isDragable: boolean }> = (
  props
) => {
  const [loaded, setLoaded] = useState(false);
  const [sidebar, setSideBar] = useState<JSX.Element>(<div className=""></div>);
  useEffect(() => {
    const sidebar: JSX.Element = (
      // <div className="absolute top-0 bottom-0 right-0 w-80 bg-black/50 z-30 rounded-2xl m-2"></div>
      <SearchSideBar />
    );
    setLoaded(true);
    setSideBar(sidebar);
  }, [loaded]);
  // const [lng, setLng] = useState<number>(props.lng);
  // const [lat, setLat] = useState<number>(props.lat);
  // const [marketPoint, setMarkerPoint] = useState<LngLatLike>([lng, lat]);

  // const [lnglat, setLngLat] = useState<LngLat>(
  //   45.72187702416752,
  //   36.76853595794939
  // );
  const [zoom, setZomm] = useState<number>(5);
  // const [map, setMap] = useState<mapboxgl.Map>();
  const setMarkerHandler = (e: MapMouseEvent) => {
    // console.log(typeof e.lngLat.lat);
    // setMarkerPoint([e.lngLat.lng, e.lngLat.lat]);
  };
  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;
    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;
    if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
        (er) => {
          console.log(er);
        },
        false // Lazy load the plugin
      );
    }
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYW1hbmMiLCJhIjoiY2w2b3F2YTQ0MDVpdTNjcXB1OGtrd2g4ciJ9.8aU5BS_hrx4_vghgcgrptA";

    const map = new mapboxgl.Map({
      attributionControl: false,
      container: node,
      style: "mapbox://styles/mapbox/streets-v11",
      doubleClickZoom: true,
    });
    map.flyTo({
      zoom: 5,
      center: [props.lng, props.lat],
    });

    // map.on("dblclick", (e) => {
    //   e.preventDefault();
    //   // console.log(e);
    //   setMarkerHandler(e);
    // });
    // map.on("moveend", () => {
    //   console.log(map.getZoom());
    //   setZomm((prev) => map.getZoom());
    //   setLat((prev) => map.getCenter().lat);
    //   setLng((prev) => map.getCenter().lng);
    // });
    // map.on("boxzoomstart", (e) => {
    //   console.log("event type:", e.type);
    //   // event type: boxzoomstart
    // });

    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    const mapmarker = new mapboxgl.Marker({
      draggable: props.isDragable,
    })
      .setLngLat([props.lng, props.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 20 }).setHTML(
          `<a
          target="_blank"
          href="/estate/126"
          style="display:block;width:150px;background-color:red"
          >
          1
          <img src="/image/product/06.jpg" style="" />
          </a>`
        )
      )
      .addTo(map);
    // new mapboxgl.Marker()
    //   .setLngLat([47.72187702416752, 36.54])
    //   .setPopup(
    //     new mapboxgl.Popup({ offset: 20 }).setHTML(
    //       `<a
    //       target="_blank"
    //       href="/productid"
    //       style="display:block;width:150px;background-color:red"
    //       >
    //       <img src="/image/product/07.jpg" style="" />
    //       2
    //       </a>`
    //     )
    //   )
    //   .addTo(map);
  });

  if (!loaded) {
    return (
      <div className="flex justify-center items-center w-full border-[10px] border-white bg-gray-400 rounded-2xl animate-pulse"></div>
    );
  }
  return (
    <div className="h-full w-full ">
      <div className="h-full w-full" ref={mapNode}></div>
    </div>
  );
};

export default SsjaMapTest;
