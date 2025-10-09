import { FC, useEffect, useRef, useState } from "react";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import Spiner from "../../spinner/Spiner";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import EstateCardDashboard from "./EstateCardDashboard";
import { rejectEstateAtom } from "./RejectEstateModal/RejectEstateModalState";
import ModalAlert from "../../modal/ModalAlert";
import GlobalState from "../../../global/states/GlobalState";

const RejectEstates: FC = () => {
  const estateService = useRef(new EstateService());
  const [rejectedEstate, setRejectedEstate] = useState<Estate[]>();
  const state = useRecoilValue<GlobalState>(globalState);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [rejectEstateState, setRejectEstateState] =
    useRecoilState(rejectEstateAtom);
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
      setErrorMessage(error as string);
    }
    setLoading((prev) => false);
  }

  const verifyEstate = async (estateId: string) => {
    if (!mounted.current) return;
    setLoading((prev) => true);

    await estateService.current.updateEstateStatus(
      estateId,
      EstateStatus.Verified
    );
    setRejectedEstate(undefined);
    await getRejectedEstate();
    setLoading((prev) => false);
  };

  const handleCloseModal = () => {
    setErrorMessage("");
    setRejectedEstate([]);
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
  if (!rejectedEstate) {
    return (
      <div className="container">
        {/* <EstateCardDashboard /> */}
        <Spiner />
      </div>
    );
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
          محتوایی وجود ندارد!!!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {rejectedEstate?.map((estate) => (
            <EstateCardDashboard
              key={estate.id}
              estate={estate}
              verifyButton={true}
              onVerify={() => verifyEstate(estate.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectEstates;
