/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from "react";
import "./SearchEstate.css";
import { motion } from "framer-motion";
import {
  crossfadeAnimation,
  elevationEffect,
} from "../../animations/motionVariants";
import { Container, Form } from "react-bootstrap";
import DelegationType from "global/types/DelegationType";
import EstateType from "global/types/EstateType";
import { Estate } from "../../global/types/Estate";
import Tilt from "react-parallax-tilt";
import React from "react";
import EstateCard from "../../components/EstateCard/EstateCard";
import { useRecoilValue } from "recoil";
import { globalState } from "global/states/globalStates";
import FormService from "services/api/FormService/FormService";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import EstateService from "services/api/EstateService/EstateService";
import toast from "react-hot-toast";
import Strings from "global/constants/strings";

function SearchEstateScreen() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);

  const [delegationType, setDelegationType] = useState<DelegationType>({
    id: "",
    name: "default",
  });
  const [estateType, setEstateType] = useState<EstateType>({
    id: "",
    name: "default",
  });
  const isDefault: boolean =
    delegationType.name !== "default" && estateType.name !== "default"
      ? true
      : false;
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function handleDelegationChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDelegationType({
      id: event.target.value,
      name: event.target.value,
    });
  }
  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setEstateType({
      id: event.target.value,
      name: event.target.value,
    });
  }

  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const mounted = useRef(true);

  useEffect(() => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    estateService.current.setToken(state.token);
    loadOptions();

    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegationType, estateType]);

  async function loadOptions() {
    toast.promise(
      delegationTypeService.current
        .getAllDelegationTypes()
        .then((delegationTypes) => {
          setDelegationTypes(delegationTypes);
        })
        .then(() => estateTypeService.current.getAllEstateTypes())
        .then((estateTypes) => {
          setEstateTypes(estateTypes);
        })
        .catch((error) => {
          console.log(error);
        }),
      {
        success: Strings.loadingOptionsSuccess,
        loading: Strings.loadingOptions,
        error: Strings.loadingOptionsFailed,
      }
    );
  }

  async function loadData() {
    if (!loading) {
      setLoading((prev) => true);
    }

    if (!delegationType.id || !estateType.id) {
      return;
    }
    // const loadedForm = await formService.current.getForm(
    //   delegationType.id,
    //   estateType.id
    // );

    // setEstates(loadedForm);
    await loadOptions();
    setLoading((prev) => false);
  }

  return (
    <div className="search-estate-container">
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="search-estate card glass shadow rounded-3 py-3 px-4 my-4"
      >
        <h2 className="search-estate-title text-center">
          {Strings.searchEstate}
        </h2>
        <form className="search-estate-form py-3">
          <label htmlFor="delegationType">{Strings.delegationType}</label>
          <Form.Select
            className="form-select rounded-3"
            name="delegationType"
            id="delegationType"
            value={delegationType.name}
            onChange={handleDelegationChange}
          >
            <option value="default" disabled>
              {Strings.choose}
            </option>
            {delegationTypes.map((option, index) => {
              return (
                <option key={index} value={option.name}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="delegationType">{Strings.estateType}</label>
          <Form.Select
            className="form-select rounded-3"
            name="estateType"
            id="estateType"
            value={estateType.name}
            onChange={handleTypeChange}
          >
            <option value="default" disabled>
              {Strings.choose}
            </option>
            {estateTypes.map((option, index) => {
              return (
                <option key={index} value={option.name}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
        </form>
      </motion.div>
      {
        <Container>
          <motion.div
            variants={crossfadeAnimation}
            initial="first"
            animate="second"
            className="estates-grid"
          >
            {loading
              ? [0, 1, 2, 3].map((_, index) => {
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
                      <EstateCard estate={estate} />
                    </React.Fragment>
                  );
                })}
          </motion.div>
        </Container>
      }
    </div>
  );
}

export default SearchEstateScreen;
