import { useState } from "react";
import { Button } from "react-bootstrap";
import Tilt from "react-parallax-tilt";

import "./Estates.css";

interface Estate {
    title: string;
    user: string;
    delegationType: string;
    estateType: string;
    city: string;
    province: string;
}

function EstatesSection() {
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
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
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
        {
            title: "فروش خانه در جام جم",
            user: "کاوه خلیلی",
            delegationType: "فروش",
            estateType: "خانه",
            city: "مهاباد",
            province: "آذربایجان غربی",
        },
    ]);

    return (
        <div className="estates-section">
            <div className="estates-grid">
                {estates.map((estate, index) => {
                    return (
                        <Tilt>
                            <div
                                className="estate card p-4 d-flex flex-row justify-content-between align-items-start"
                                key={index}
                            >
                                <div className="estate-info d-flex flex-column justify-content-center align-items-start">
                                    <div>
                                        <h4 className="estate-title fs-4 fw-normal">
                                            <i className="bi-building ms-3"></i>
                                            {estate.title}
                                        </h4>
                                    </div>
                                    <h4 className="delegation-and-estate-type fs-5 fw-bold py-4">
                                        {estate.delegationType}{" "}
                                        {estate.estateType}
                                    </h4>
                                    <h5 className="user fw-light">
                                        <i className="bi-person-fill ms-3"></i>
                                        {estate.user}
                                    </h5>
                                    <h6 className="province-and-city fw-light text-secondary">
                                        {estate.city}، {estate.province}
                                    </h6>
                                </div>
                                <div className="buttons gap-2 d-flex flex-column">
                                    <Button
                                        className="verify-btn"
                                        variant="outline-success"
                                    >
                                        <i className="verify-icon bi-check2"></i>
                                    </Button>
                                    <Button
                                        className="reject-btn"
                                        variant="outline-danger"
                                    >
                                        <i className="reject-icon bi-x"></i>
                                    </Button>
                                    <Button
                                        className="info-btn"
                                        variant="outline-secondary"
                                    >
                                        <i className="info-icon bi-info-circle-fill"></i>
                                    </Button>
                                </div>
                            </div>
                        </Tilt>
                    );
                })}
            </div>
        </div>
    );
}

export default EstatesSection;
