import { json } from "node:stream/consumers";
import { FC, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import RealEstateCard from "../../home/real-estate-card/RealEstateCard";
import Spiner from "../../spinner/Spiner";
import EstateCardDashboard from "./EstateCardDashboard";

const AllEstateStatus: FC = () => {
  const estateService = useRef(new EstateService());
  const [estates, setEstates] = useState<Estate[]>();
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  useEffect(() => {
    estateService.current.setToken(state.token);
    console.log(state.role);

    loadData();
    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  async function loadData() {
    try {
      await estateService.current
        .getUserEstates()
        .then((allEstate) => setEstates(allEstate));
    } catch (error) {
      console.log(error);
    }
  }

  if (!estates) {
    return (
      <div className="container">
        <Spiner />
      </div>
    );
  }
  return (
    <div className="container">
      {estates!.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-gray-300">
          ملکی یافت نشد!!!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {estates?.map((estate) => (
            <EstateCardDashboard
              key={estate.id}
              estate={estate}
              userRole={state.role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEstateStatus;
