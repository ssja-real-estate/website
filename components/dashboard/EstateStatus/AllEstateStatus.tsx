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
  const [unverifiedEstate, setUnverifiedEstate] = useState<Estate[]>([]);
  const [rejectedEstate, setRejectedEstate] = useState<Estate[]>([]);
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  useEffect(() => {
    estateService.current.setToken(state.token);
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

  async function getUnverifiedEstate() {
    try {
      await estateService.current
        .getEstates(EstateStatus.Unverified)
        .then((allEstate) => setUnverifiedEstate(allEstate));
    } catch (error) {
      console.log(error);
    }
  }

  async function getRejectedEstate() {
    try {
      await estateService.current
        .getEstates(EstateStatus.Rejected)
        .then((allEstate) => setRejectedEstate(allEstate));
    } catch (error) {
      console.log(error);
    }
  }

  if (!estates) {
    return (
      <div className="container">
        {/* <EstateCardDashboard /> */}
        <Spiner />
      </div>
    );
  }
  return (
    <div className="container">
      {/* <div className="flex flex-row justify-center items-center border-b gap-1 text-sm">
        <div className="py-2 px-2 z-10 border-b-white border-b  border-t-4 border-t-[#0ba] scale-105">
          املاک تأیید شده
        </div>
        <div className="py-2 px-2 bg-gray-300 border-t-4 border-t-white">
          املاک در انتظار تأیید
        </div>
        <div className="py-2 px-2 bg-gray-300 border-t-4 border-t-white">
          املاک رد شده
        </div>
      </div> */}

      {/* <h2 className="font-bold text-dark-blue mb-5">املاک تأیید شده</h2> */}
      {estates!.length === 0 ? (
        <div className="text-gray">هیچ ملکی یافت نشد</div>
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

      {/* <div className="">
        <h2 className="font-bold text-dark-blue mb-5">املاک در انتظار تأیید</h2>
        {unverifiedEstate.length === 0 ? (
          <div className="text-center text-gray-400">
            ملک تأیید نشده ای یافت نشد!!!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {unverifiedEstate?.map((estate) => (
              <RealEstateCard key={estate.id} estates={estate} />
            ))}
          </div>
        )}
      </div> */}
      {/* <div className="">
        <h2 className="font-bold text-dark-blue mb-5">املاک رد شده</h2>
        {rejectedEstate.length === 0 ? (
          <div className="text-center text-gray-400">
            ملک رد شده ای یافت نشد!!!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {rejectedEstate?.map((estate) => (
              <RealEstateCard key={estate.id} estates={estate} />
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default AllEstateStatus;
