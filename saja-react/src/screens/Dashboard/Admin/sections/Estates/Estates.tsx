import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
import {
    delegationTypes,
    estateTypes,
} from "../../../../../global/constants/estates";
import { Estate } from "../../../../../global/types/Estate";
import "./Estates.css";

function EstatesSection() {
    const [delegationType, setDelegationType] = useState<string>("default");
    const [estateType, setEstateType] = useState<string>("default");
    const [location, setLocation] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [estates, setEstates] = useState<Estate[]>([
        {
            title: "فروش خانه در جام جم",
            user: "کاوه خلیلی",
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
        {
            title: "فروش خانه در جام جم",
            user: "کاوه خلیلی",
            delegationType: "اجاره",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
        {
            title: "فروش خانه در جام جم",
            user: "کاوه خلیلی",
            delegationType: "اجاره",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
        {
            title: "فروش خانه در جام جم",
            user: "کاوه خلیلی",
            delegationType: "فروش",
            estateType: "آپارتمان",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
        {
            title: "فروش خانه در جام جم",
            user: "کاوه خلیلی",
            delegationType: "فروش",
            estateType: "آپارتمان",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
    ]);
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
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="estates-section">
            <div className="estates-filter card shadow p-4 mb-4">
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
                    : estates
                          //   .filter((estate) => {
                          //       return delegationType === "default" &&
                          //           estateType === "default" &&
                          //           location.trim() === ""
                          //           ? true
                          //           : delegationType === "default"
                          //           ? (estate.estateType === estateType &&
                          //                 estate.city === location.trim()) ||
                          //             estate.province === location.trim()
                          //           : estateType === "default"
                          //           ? (estate.delegationType === delegationType &&
                          //                 estate.city === location.trim()) ||
                          //             estate.province === location.trim()
                          //           : location.trim() === ""
                          //           ? estate.delegationType === delegationType &&
                          //             estate.estateType === estateType
                          //           : estate.delegationType === delegationType &&
                          //             estate.estateType === estateType;
                          //   })
                          .map((estate, index) => {
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
