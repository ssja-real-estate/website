/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useRef, useState } from "react";
import NeshanMap from "react-neshan-map-leaflet";

// latLang : {lat: 212, lng: 322}
// position: [654564, 54654]
// zoom : 10
// readOnly : true
const MapScreen = (props) => {
  const defaultLatLang = {
    lat: 35.706408599732605,
    lng: 411.4163636999659,
  };
  const defaultZoom = 9;

  const latLang = props.latLang ?? defaultLatLang;
  const zoom = props.zoom ?? defaultZoom;
  const position = [latLang.lat, latLang.lng];
  const [, setMap] = useState();
  const [firstRender, setFirstRender] = useState(true);
  // const [position, setPosition] = useState([latLang.lat, latLang.lng]);
  const [defaultOptions, setDefaultOptions] = useState({
    key: process.env.REACT_APP_MAP_WEB_API_KEY,
    maptype: "osm-bright",
    poi: true,
    traffic: false,
    center: position,
    zoom: zoom,
  });
  // const [defaultCircle, setDefaultCircle] = useState({
  //   color: "lightblue",
  //   fillColor: "blue",
  //   fillOpacity: 0.2,
  //   radius: 400,
  // });
  const [defaultStyle, setDefaultStyle] = useState({
    borderRadius: 4,
    height: "85vh",
    width: "100%",
    zIndex: -10,
  });
  const mounted = useRef(true);

  useEffect(() => {
    reRenderMap();
    return () => {
      mounted.current = false;
    };
  }, [latLang, zoom]);

  const reRenderMap = () => {
    if (firstRender) return;
    setMap((prevMap) => {
      prevMap.setZoom(zoom);
      prevMap.flyTo(position);
      return prevMap;
    });
  };

  const onInit = (L, map) => {
    // let marker = undefined;
    if (firstRender) {
      setMap(map);
      // marker = L.marker(position).addTo(map);
      // .bindPopup("");
      // marker.setLatLng(latLang);
      // setMarker(newMarker);
      setFirstRender((prev) => false);
    }

    // map.on("click", function (e) {
    //   console.log("click");
    //   marker.setLatLng(e.latlng);
    //   console.log(e.latlng);
    // });

    // L.circle(position, defaultCircle).addTo(map);
  };

  return (
    <NeshanMap style={defaultStyle} options={defaultOptions} onInit={onInit} />
  );
};

export default MapScreen;
