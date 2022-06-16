/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomModal from "components/CustomModal/CustomModal";
import EstateInfoModal from "components/EstateInfoModal/EstateInfoModal";
import {
  defaultEstateInfoModalState,
  estateInfoModalAtom,
} from "components/EstateInfoModal/EstateInfoModalState";
import RejectEstateModal from "components/RejectEstateModal/RejectEstateModal";
import {
  defaultRejectEstate,
  rejectEstateAtom,
} from "components/RejectEstateModal/RejectEstateModalState";
import Strings from "global/constants/strings";
import { estateScreenAtom, ScreenType } from "global/states/EstateScreen";
import { globalState } from "global/states/globalStates";
import React, { useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import EstateService from "services/api/EstateService/EstateService";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
import { Estate, EstateStatus } from "../../../../../global/types/Estate";
import "./Estates.css";

interface Props {
  status?: EstateStatus;
  isUserEstatesScreen?: boolean;
}

const loadingItems = [1, 1, 1, 1, 1, 1, 1, 1];

function EstatesSection({
  status = EstateStatus.Unverified,
  isUserEstatesScreen,
}: Props) {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [estateInfoModalState, setEstateInfoModalState] =
    useRecoilState(estateInfoModalAtom);
  const [rejectEstateState, setRejectEstateState] =
    useRecoilState(rejectEstateAtom);

  const setEstateScreenState = useSetRecoilState(estateScreenAtom);
  const state = useRecoilValue(globalState);
  const estateService = useRef(new EstateService());
  const mounted = useRef(true);
  const history = useHistory();

  useEffect(() => {
    estateService.current.setToken(state.token);

    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    mounted.current = true;
    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const loadData = async () => {
    if (!mounted.current) {
      return;
    }
    setLoading((prev) => true);
    let fetchedEstates = isUserEstatesScreen
      ? await estateService.current.getUserEstates()
      : await estateService.current.getEstates(status);

    if (fetchedEstates) {
      setEstates(fetchedEstates);
    }

    setLoading((prev) => false);
  };

  const verifyEstate = async (estateId: string) => {
    if (!mounted.current) return;
    setLoading((prev) => true);

    await estateService.current.updateEstateStatus(
      estateId,
      EstateStatus.Verified
    );

    await loadData();

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
    await loadData();
    setLoading((prev) => false);
  };

  return (
    <div className="estates-section">
      <div className="estates-grid">
        {loading
          ? loadingItems.map((_, index) => {
              return (
                <Tilt key={index}>
                  <div className="estate card shadow rounded-3 p-4">
                    <h4 className="card-title placeholder-glow d-flex flex-column justify-content-center align-items-start">
                      <span className="placeholder col-6 py-3 rounded-3"></span>
                    </h4>
                    <h4 className="card-text placeholder-glow">
                      <span className="placeholder col-4 my-4 rounded-3 d-block"></span>
                      <span className="placeholder col-4 my-2 rounded-3 d-block"></span>
                      <span className="placeholder col-4 my-2 rounded-3 d-block"></span>
                    </h4>
                  </div>
                </Tilt>
              );
            })
          : estates.map((estate, index) => {
              return (
                <React.Fragment key={index}>
                  <EstateCard
                    estate={estate}
                    editButton={
                      status === EstateStatus.Verified && isUserEstatesScreen
                    }
                    verifyButton={status !== EstateStatus.Verified}
                    rejectButton={status === EstateStatus.Unverified}
                    showEstateInfoButton
                    showBadge={isUserEstatesScreen}
                    onEdit={() => {
                      setEstateScreenState((prev) => ({
                        ...prev,
                        inputEstate: estate,
                        screenType: ScreenType.Edit,
                      }));
                      history.push("/edit-estate");
                    }}
                    onVerify={() => verifyEstate(estate.id)}
                    onReject={
                      status !== EstateStatus.Rejected
                        ? () => {
                            setRejectEstateState({
                              estateId: estate.id,
                              description:
                                estate.estateStatus.description ?? "",
                              showModal: true,
                            });
                          }
                        : undefined
                    }
                    onShowEstateInfo={() => {
                      setEstateInfoModalState({
                        estate,
                        showModal: true,
                      });
                    }}
                  />
                </React.Fragment>
              );
            })}
      </div>
      <CustomModal
        show={estateInfoModalState.showModal}
        title={Strings.estateInfo}
        cancelTitle={Strings.close}
        handleClose={() => {
          setEstateInfoModalState(defaultEstateInfoModalState);
        }}
      >
        <EstateInfoModal />
      </CustomModal>
      <CustomModal
        show={rejectEstateState.showModal}
        title={Strings.rejectEstate}
        successTitle={Strings.save}
        cancelTitle={Strings.cancel}
        handleSuccess={rejectEstate}
        handleClose={() => {
          setRejectEstateState(defaultRejectEstate);
        }}
      >
        <RejectEstateModal />
      </CustomModal>
    </div>
  );
}

export default EstatesSection;
