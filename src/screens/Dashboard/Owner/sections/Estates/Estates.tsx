/* eslint-disable @typescript-eslint/no-unused-vars */
import { globalState } from "global/states/globalStates";
import React, { useEffect, useRef, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { useRecoilState } from "recoil";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
import { Estate } from "../../../../../global/types/Estate";
import DelegationType from "global/types/DelegationType";
import EstateType from "global/types/EstateType";
import "./Estates.css";

function EstatesSection() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [delegationType, setDelegationType] = useState<string>("default");
  const [estateType, setEstateType] = useState<string>("default");
  const [location, setLocation] = useState<string>("");
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [state, setGlobalState] = useRecoilState(globalState);
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
    }

    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  const handleDelegationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDelegationType(event.target.value);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEstateType(event.target.value);
  };
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  return (
    <div className="estates-section">
      <div className="estates-filter card shadow p-4 mb-4 sticky-top">
        <Row md={4}>
          <h4 className="fw-light">فیلتر نتایج</h4>
          <div>
            <Form.Select
              value={delegationType}
              onChange={handleDelegationChange}
            >
              <option value="default">همه</option>
              {delegationTypes.map((option, index) => {
                return (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div>
            <Form.Select value={estateType} onChange={handleTypeChange}>
              <option value="default">همه</option>
              {estateTypes.map((option, index) => {
                return (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div>
            <Form.Control
              type="text"
              id="location"
              name="location"
              placeholder="مکان"
              value={location}
              onChange={handleLocationChange}
            />
          </div>
        </Row>
      </div>
      <div className="estates-grid">
        {loading
          ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
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
                  <EstateCard estate={estate} verifyButton rejectButton />
                </React.Fragment>
              );
            })}
      </div>
    </div>
  );
}

export default EstatesSection;
