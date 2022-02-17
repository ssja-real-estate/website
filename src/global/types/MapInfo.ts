interface MapInfo {
  latitude: number;
  longitude: number;
  zoom: number;
}

const defaultMapInfo: MapInfo = {
  latitude: 0,
  longitude: 0,
  zoom: 7,
};

export default MapInfo;

export { defaultMapInfo };
