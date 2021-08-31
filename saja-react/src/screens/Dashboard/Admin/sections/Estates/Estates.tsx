import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
import {
    delegationTypes,
    estateTypes,
} from "../../../../../global/constants/estates";
import { Estate } from "../../../../../global/types/Estate";
import { fetchData } from "../../../../../services/api/fetchData";
import "./Estates.css";

function EstatesSection() {
    const [delegationType, setDelegationType] = useState<string>("default");
    const [estateType, setEstateType] = useState<string>("default");
    const [location, setLocation] = useState<string>("");
    const [estates, setEstates] = useState<Estate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function handleDelegationChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        setDelegationType(event.target.value);
    }
    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setEstateType(event.target.value);
    }
    function handleLocationChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLocation(event.target.value);
    }

    useEffect(() => {
        fetchData("http://localhost:8000/estates").then((data) => {
            setEstates(data);
            setLoading(false);
        });
    }, []);

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
                                    <option key={index} value={option.value}>
                                        {option.value}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </div>
                    <div>
                        <Form.Select
                            value={estateType}
                            onChange={handleTypeChange}
                        >
                            <option value="default">همه</option>
                            {estateTypes.map((option, index) => {
                                return (
                                    <option key={index} value={option.value}>
                                        {option.value}
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
                                  <EstateCard
                                      estate={estate}
                                      verifyButton
                                      rejectButton
                                  />
                              </React.Fragment>
                          );
                      })}
            </div>
        </div>
    );
}

export default EstatesSection;
