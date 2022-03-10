/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomModal from "components/CustomModal/CustomModal";
import EstateInfoModal from "components/EstateInfoModal/EstateInfoModal";
import {
  defaultEstateInfoModalState,
  estateInfoModalAtom,
} from "components/EstateInfoModal/EstateInfoModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import React, { useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { useRecoilState, useRecoilValue } from "recoil";
import EstateService from "services/api/EstateService/EstateService";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
import { Estate } from "../../../../../global/types/Estate";
import "./Estates.css";

const loadingItems = [1, 1, 1, 1, 1, 1, 1, 1];

function EstatesSection() {
  const [userEstates, setUserEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [estateInfoModalState, setEstateInfoModalState] =
    useRecoilState(estateInfoModalAtom);

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
    const userEstates = await estateService.current.getUserEstates();

    if (userEstates) {
      setUserEstates(userEstates);
    }

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
          : userEstates.map((estate, index) => {
              return (
                <React.Fragment key={index}>
                  <EstateCard
                    estate={estate}
                    rejectButton
                    onReject={() => {}}
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
    </div>
  );
}

export default EstatesSection;
