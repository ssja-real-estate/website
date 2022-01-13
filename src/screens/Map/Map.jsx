/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import NeshanMap from "react-neshan-map-leaflet";
// import MapService from "services/api/MapService/MapService";

const MapScreen = ({ latLang, position, readOnly }) => {
  const [defaultZoom, setDefaultZoom] = useState(15);
  const [defaultOptions, setDefaultOptions] = useState({
    key: process.env.REACT_APP_MAP_WEB_API_KEY,
    maptype: "neshan",
    poi: true,
    traffic: false,
    center: position,
    zoom: defaultZoom,
  });
  const [defaultCircle, setDefaultCircle] = useState({
    color: "lightblue",
    fillColor: "blue",
    fillOpacity: 0.2,
    radius: 400,
  });
  const [defaultStyle, setDefaultStyle] = useState({
    width: "100vw",
    height: "100vh",
  });
  // const mapService = useRef(new MapService());
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <NeshanMap
      style={defaultStyle}
      options={defaultOptions}
      onInit={(L, myMap) => {
        console.log("on init");
        let marker = L.marker(position).addTo(myMap).bindPopup("hello");
        marker.setLatLng(latLang);

        if (!readOnly) {
          myMap.on("click", function (e) {
            marker.setLatLng(e.latlng);
            console.log(e.latlng);
          });
        }

        L.circle(position, defaultCircle).addTo(myMap);
      }}
    />
  );
};

export default MapScreen;
