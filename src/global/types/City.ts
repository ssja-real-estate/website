import MapInfo from "./MapInfo";
import Neighborhood from "./Neighborhood";

interface City {
  id: string;
  name: string;
  neighborhoods: Neighborhood[];
  mapInfo?: MapInfo;
}

export default City;
