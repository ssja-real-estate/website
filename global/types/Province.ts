import City from "./City";
import MapInfo, { defaultMapInfo } from "./MapInfo";

interface Province {
  id: string;
  name: string;
  cities: City[];
  mapInfo?: MapInfo;
}

export const defaultProvince: Province = {
  id: "",
  name: "",
  cities: [],
  mapInfo: defaultMapInfo,
};

export default Province;
