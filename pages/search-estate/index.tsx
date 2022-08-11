import { NextPage } from "next";

import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";

const SearchEstate: NextPage = () => {
  const [map, setMap] = useState<mapboxgl.Map>();

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
        (er) => er,
        true // Lazy load the plugin
      );
    }
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYW1hbmMiLCJhIjoiY2w2b3F2YTQ0MDVpdTNjcXB1OGtrd2g4ciJ9.8aU5BS_hrx4_vghgcgrptA";

    const mapbox = new mapboxgl.Map({
      container: node,
      localIdeographFontFamily: "Tahoma",

      style: "mapbox://styles/mapbox/streets-v11",

      center: [45.72068978424537, 36.769031445163776],
      zoom: 13,
    });
  });

  return (
    <div
      className="container w-full h-[500px] mb-20"
      style={{ fontFamily: "Tahoma", direction: "ltr" }}
      ref={mapNode}
      id={"myMap"}
    ></div>
  );
};

export default SearchEstate;
