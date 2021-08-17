import React, { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import EstateCard from "../../../../../components/EstateCard/EstateCard";
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
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="estates-section">
            <div className="estates-grid">
                {loading
                    ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                          return (
                              <Tilt key={index}>
                                  <div className="estate card rounded-3 p-4">
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
            </div>
        </div>
    );
}

export default EstatesSection;
