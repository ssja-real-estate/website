/* eslint-disable @typescript-eslint/no-unused-vars */
import { globalState } from "global/states/globalStates";
import React, { useEffect, useRef, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
import { Estate } from "../../../../../global/types/Estate";
import DelegationType from "global/types/DelegationType";
import EstateType from "global/types/EstateType";
import "./Estates.css";
import EstateService from "services/api/EstateService/EstateService";
import {
  defaultEstateInfoModalState,
  estateInfoModalAtom,
} from "components/EstateInfoModal/EstateInfoModalState";
import CustomModal from "components/CustomModal/CustomModal";
import EstateInfoModal from "components/EstateInfoModal/EstateInfoModal";
import Strings from "global/constants/strings";
import {
  defaultRejectEstate,
  rejectEstateAtom,
} from "components/RejectEstateModal/RejectEstateModalState";
import RejectEstateModal from "components/RejectEstateModal/RejectEstateModal";

const loadingItems = [1, 1, 1, 1, 1, 1, 1, 1];

function EstatesSection() {
  const [unverifiedEstates, setUnverifiedEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [estateInfoModalState, setEstateInfoModalState] =
    useRecoilState(estateInfoModalAtom);
  const [rejectEstateState, setRejectEstateState] =
    useRecoilState(rejectEstateAtom);

  const state = useRecoilValue(globalState);
  const estateService = useRef(new EstateService());
  const mounted = useRef(true);

  useEffect(() => {
    estateService.current.setToken(state.token);

    loadData();

    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  const loadData = async () => {
    if (!mounted.current) {
      return;
    }
    setLoading((prev) => true);
    const unverifiedEstates =
      await estateService.current.getUnverifiedEstates();

    console.log(unverifiedEstates);

    if (unverifiedEstates) {
      setUnverifiedEstates(unverifiedEstates);
    }

    setLoading((prev) => false);
  };

  const verifyEstate = async (estateId: string) => {
    if (!mounted.current) return;
    setLoading((prev) => true);

    await estateService.current.verifyEstate(estateId);

    await loadData();

    setLoading((prev) => false);
  };

  const rejectEstate = async () => {
    if (!mounted.current || !rejectEstateState.estateId) return;
    setLoading((prev) => true);

    console.log(rejectEstateState);

    await estateService.current.rejectEstate(
      rejectEstateState.estateId,
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
          : unverifiedEstates.map((estate, index) => {
              return (
                <React.Fragment key={index}>
                  <EstateCard
                    estate={estate}
                    verifyButton
                    rejectButton
                    onVerify={() => verifyEstate(estate.id)}
                    onReject={() => {
                      setRejectEstateState({
                        estateId: estate.id,
                        description: estate.rejectionStatus.description,
                        showModal: true,
                      });
                    }}
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
