import { FC, useEffect, useRef, useState } from "react";
import { Estate, EstateStatus } from "../../../global/types/Estate";
import EstateService from "../../../services/api/EstateService/EstateService";
import Spiner from "../../spinner/Spiner";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import EstateCardDashboard from "./EstateCardDashboard";
import {
  defaultRejectEstate,
  rejectEstateAtom,
} from "./RejectEstateModal/RejectEstateModalState";
import CustomModal from "../../modal/CustomModal";
import Strings from "../../../data/strings";
import RejectModal from "../../modal/RejectModal";

const UnVerigyEstate: FC = () => {
  const estateService = useRef(new EstateService());
  const [rejectEstateState, setRejectEstateState] =
    useRecoilState(rejectEstateAtom);
  const [unVerifyEstates, setUnVerifyEstates] = useState<Estate[]>();
  const [loading, setLoading] = useState(true);
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
  const verifyEstate = async (estateId: string) => {
    if (!mounted.current) return;
    setLoading((prev) => true);

    await estateService.current.updateEstateStatus(
      estateId,
      EstateStatus.Verified
    );
    setUnVerifyEstates(undefined);
    await getUnverifiedEstate();
    setLoading((prev) => false);
  };

  const rejectEstate = async () => {
    if (!mounted.current || !rejectEstateState.estateId) return;
    setLoading((prev) => true);

    await estateService.current.updateEstateStatus(
      rejectEstateState.estateId,
      EstateStatus.Rejected,
      rejectEstateState.description
    );

    setRejectEstateState(defaultRejectEstate);
    setUnVerifyEstates(undefined);
    await getUnverifiedEstate();
    setLoading((prev) => false);
  };

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
        <div className="h-full w-full flex items-center justify-center text-gray-300">
          محتوایی وجود ندارد!!!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {unVerifyEstates?.map((estate) => (
            <EstateCardDashboard
              key={estate.id}
              estate={estate}
              rejectButton={true}
              verifyButton={true}
              onVerify={() => verifyEstate(estate.id)}
              onReject={
                estate.estateStatus.status !== EstateStatus.Rejected
                  ? () => {
                      setRejectEstateState({
                        estateId: estate.id,
                        description: estate.estateStatus.description ?? "",
                        showModal: true,
                      });
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}
      <CustomModal
        show={rejectEstateState.showModal}
        title={Strings.rejectEstate}
        successTitle={Strings.save}
        cancelTitle={Strings.cancel}
        handleSuccess={rejectEstate}
        handleClose={() => setRejectEstateState(defaultRejectEstate)}
      >
        <RejectModal />
      </CustomModal>
    </div>
  );
};

export default UnVerigyEstate;
