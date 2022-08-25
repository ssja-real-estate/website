interface MapInfo {
  latitude: number;
  longitude: number;
  zoom: number;
}

const defaultMapInfo: MapInfo = {
  latitude: 51.3339107163427,
  longitude: 335.783841870180055,
  zoom: 7,
};

export default MapInfo;

export { defaultMapInfo };
