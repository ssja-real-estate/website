import { json } from "node:stream/consumers";
import { FC, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import RealEstateCard from "../../home/real-estate-card/RealEstateCard";

const AllEstateStatus: FC = () => {
  const estateService = useRef(new EstateService());
  const [verifiedEstate, setverifiedEstate] = useState<Estate[]>([]);
  const [unverifiedEstate, setUnverifiedEstate] = useState<Estate[]>([]);
  const [rejectedEstate, setRejectedEstate] = useState<Estate[]>([]);
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  useEffect(() => {
    estateService.current.setToken(state.token);
    getVerifiedEstate();
    getUnverifiedEstate();
    getRejectedEstate();
    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  async function getVerifiedEstate() {
    try {
      await estateService.current
        .getEstates(EstateStatus.Verified)
        .then((allEstate) => setverifiedEstate(allEstate));
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

  return (
    <div className="container">
      <div className="">
        <h2 className="font-bold text-dark-blue mb-10">املاک تأیید شده</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {verifiedEstate?.map((estate) => (
            <RealEstateCard key={estate.id} estates={estate} />
          ))}
        </div>
      </div>

      <div className="">
        <h2 className="font-bold text-dark-blue mb-10">
          املاک در انتظار تأیید
        </h2>
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
      </div>
      <div className="">
        <h2 className="font-bold text-dark-blue mb-10">املاک رد شده</h2>
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
      </div>
    </div>
  );
};

export default AllEstateStatus;
