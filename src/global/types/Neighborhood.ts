import MapInfo from "./MapInfo";

interface Neighborhood {
  id: string;
  name: string;
  mapInfo?: MapInfo;
}

export const defaultNeighborhood = {
  id: "",
  name: "",
};

export default Neighborhood;
