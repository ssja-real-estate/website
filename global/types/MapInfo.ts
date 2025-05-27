interface MapInfo {
  latitude: number;
  longitude: number;
  zoom: number;
}

const defaultMapInfo: MapInfo = {
  latitude: 32.4279,
  longitude: 53.6880,
  zoom: 4,
};

export default MapInfo;

export { defaultMapInfo };
