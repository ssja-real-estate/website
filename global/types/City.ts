import MapInfo from "./MapInfo";
import Neighborhood from "./Neighborhood";

interface City {
  id: string;
  name: string;
  neighborhoods: Neighborhood[];
  mapInfo?: MapInfo;
}

export const defaultCity: City = {
  id: "",
  name: "",
  neighborhoods: [],
};

export default City;
