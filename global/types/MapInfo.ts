interface MapInfo {
  latitude: number;
  longitude: number;
  zoom: number;
}

const defaultMapInfo: MapInfo = {
  latitude: 35.68957425,
  longitude: 51.39440926,
  zoom: 5,
};

export default MapInfo;

export { defaultMapInfo };
