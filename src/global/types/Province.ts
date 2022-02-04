import City from "./City";
import MapInfo from "./MapInfo";

interface Province {
  id: string;
  name: string;
  cities: City[];
  mapInfo?: MapInfo;
}

export default Province;
