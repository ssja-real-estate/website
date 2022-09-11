import { FC, useEffect, useRef, useState } from "react";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import Spiner from "../../spinner/Spiner";
import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import EstateCardDashboard from "./EstateCardDashboard";

const RejectEstates: FC = () => {
  const estateService = useRef(new EstateService());
  const [rejectedEstate, setRejectedEstate] = useState<Estate[]>();
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  useEffect(() => {
    estateService.current.setToken(state.token);
    getRejectedEstate();
    return () => {
      mounted.current = false;
    };
  }, [state.token]);
  async function getRejectedEstate() {
    try {
      await estateService.current
        .getEstates(EstateStatus.Rejected)
        .then((allEstate) => setRejectedEstate(allEstate));
    } catch (error) {
      console.log(error);
    }
  }
  if (!rejectedEstate) {
    return (
      <div className="container">
        {/* <EstateCardDashboard /> */}
        <Spiner />
      </div>
    );
  }
  return (
    <div className="container">
      {rejectedEstate!.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-gray-300">
          ملک تأیید نشده ای یافت نمی شود
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {rejectedEstate?.map((estate) => (
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

export default RejectEstates;
