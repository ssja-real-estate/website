import { FC, useEffect, useRef, useState } from "react";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import Spiner from "../../spinner/Spiner";
import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import EstateCardDashboard from "./EstateCardDashboard";

const UnVerigyEstate: FC = () => {
  const estateService = useRef(new EstateService());
  const [unVerifyEstates, setUnVerifyEstates] = useState<Estate[]>();
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  useEffect(() => {
    estateService.current.setToken(state.token);
    getUnverifiedEstate();
    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  async function getUnverifiedEstate() {
    try {
      await estateService.current
        .getEstates(EstateStatus.Unverified)
        .then((allEstate) => setUnVerifyEstates(allEstate));
    } catch (error) {
      console.log(error);
    }
  }

  if (!unVerifyEstates) {
    return (
      <div className="container">
        {/* <EstateCardDashboard /> */}
        <Spiner />
      </div>
    );
  }

  return (
    <div className="container">
      {unVerifyEstates!.length === 0 ? (
        <div className="text-gray">هیچ ملکی یافت نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {unVerifyEstates?.map((estate) => (
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

export default UnVerigyEstate;
