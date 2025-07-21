import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
// import allRealState from "../../../data/all-realEastate";
import RealEastate from "../../../data/models/real-estate";
import Strings from "../../../data/strings";
import { globalState } from "../../../global/states/globalStates";
import { Estate } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import NewViewHouses from "../view-houses/NewViewHouses";
import Image from "next/image";
import ShimerAnimationEstateCard from "../../ShimerAnimitionEstateCard/ShimerAnimationEstateCard";

function MortgageRentSale() {
  const [activeIndex, setActiveIndex] = useState(0);
  const estateService = useRef(new EstateService());
  const [allEstate, setAllEstate] = useState<Estate[]>([]);
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  const tabData: string[] = [Strings.mortgage, Strings.rent, Strings.sale];
  const indexHandler = (index: number) => {
    setActiveIndex(index);
  };
  // const allRealEsates: RealEastate[] = allRealState;
  useEffect(() => {
    estateService.current.setToken(state.token);
    // getAllEstate();
    getAllEstate();
    return () => {
      mounted.current = false;
    };
  }, [state.token]);

 
  async function getAllEstate() {
    try {
      await estateService.current
        .getLastEstates()
        .then((allEstate) => setAllEstate(allEstate));
    } catch (error) {
      console.log(error);
    }
  }
  if (allEstate.length === 0) {
    return (
      <div className="container grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 mt-20 mb-20">
        {[1, 2, 3].map((i) => (
          <ShimerAnimationEstateCard key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-20">
     
      <h2 className="container text-dark-blue text-[50px] text-center font-bold my-10 ">
        املاک جدید
      </h2>
      <NewViewHouses allestates={allEstate} />
    </div>
  );
}

export default MortgageRentSale;
