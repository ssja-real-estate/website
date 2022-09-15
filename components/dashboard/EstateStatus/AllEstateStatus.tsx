import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { json } from "node:stream/consumers";
import { FC, useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  estateScreenAtom,
  ScreenType,
} from "../../../global/states/EstateScreen";
import { globalState } from "../../../global/states/globalStates";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import CustomModal from "../../modal/CustomModal";
import ModalAlert from "../../modal/ModalAlert";

import Spiner from "../../spinner/Spiner";
import EstateCardDashboard from "./EstateCardDashboard";

const AllEstateStatus: FC = () => {
  const estateService = useRef(new EstateService());
  const [estates, setEstates] = useState<Estate[]>();
  const router = useRouter();
  const setEstateScreenState = useSetRecoilState(estateScreenAtom);
  const state = useRecoilValue(globalState);
  const mounted = useRef(true);
  const [errorMessage, setErrorMessage] = useState("");
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

      // console.log((error as AxiosError).message);
      setErrorMessage(error as string);
      return;
      // console.log(error);
    }
  }
  const handleCloseModal = () => {
    setErrorMessage("");
    setEstates([]);
  };
  if (errorMessage) {
    return (
      <div className="container">
        <ModalAlert
          show={errorMessage ? true : false}
          handleClose={handleCloseModal}
          cancelTitle="بستن"
        >
          <div className="text-red-700 flex justify-center">{errorMessage}</div>
        </ModalAlert>
      </div>
    );
  }
  if (!estates) {
    return (
      <div className="container">
        <Spiner />
      </div>
    );
  }
  console.log(estates);

  return (
    <div className="container">
      {estates!.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-gray-300">
          محتوایی وجود ندارد!!!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {estates?.map((estate) => (
            <EstateCardDashboard
              key={estate.id}
              estate={estate}
              editButton={true}
              onEdit={() => {
                setEstateScreenState((prev) => ({
                  ...prev,
                  inputEstate: estate,
                  screenType: ScreenType.Edit,
                }));
                router.push("/edit-estate");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEstateStatus;
