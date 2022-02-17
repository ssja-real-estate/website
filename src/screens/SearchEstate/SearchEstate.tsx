/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
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

function SearchEstateScreen() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);

  const [delegationType, setDelegationType] = useState<string>("default");
  const [estateType, setEstateType] = useState<string>("default");
  // const isDefault: boolean =
  //     delegationType !== "default" && estateType !== "default" ? true : false;
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function handleDelegationChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDelegationType(event.target.value);
  }
  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setEstateType(event.target.value);
  }

  useEffect(() => {
    setLoading(true);
    // getData();
  }, [delegationType, estateType]);

  return (
    <div className="search-estate-container">
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="search-estate card glass shadow rounded-3 py-3 px-4 my-4"
      >
        <h2 className="search-estate-title text-center">جستجوی ملک</h2>
        <form className="search-estate-form py-3">
          <label htmlFor="delegationType">نوع واگذاری</label>
          <Form.Select
            className="form-select rounded-3"
            name="delegationType"
            id="delegationType"
            value={delegationType}
            onChange={handleDelegationChange}
          >
            <option value="default" disabled>
              انتخاب کنید
            </option>
            {delegationTypes.map((option, index) => {
              return (
                <option key={index} value={option.name}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="delegationType">نوع ملک</label>
          <Form.Select
            className="form-select rounded-3"
            name="estateType"
            id="estateType"
            value={estateType}
            onChange={handleTypeChange}
          >
            <option value="default" disabled>
              انتخاب کنید
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
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => {
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
