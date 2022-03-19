/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from "react";
import "./SearchEstate.css";
import { motion } from "framer-motion";
import {
  crossfadeAnimation,
  elevationEffect,
} from "../../animations/motionVariants";
import { Button, Container, Form } from "react-bootstrap";
import DelegationType, {
  defaultDelegationType,
} from "global/types/DelegationType";
import EstateType, { defaultEstateType } from "global/types/EstateType";
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
import City, { defaultCity } from "global/types/City";
import Neighborhood, { defaultNeighborhood } from "global/types/Neighborhood";
import Province, { defaultProvince } from "global/types/Province";
import LocationService from "services/api/LocationService/LocationService";

function SearchEstateScreen() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<Province>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood>(defaultNeighborhood);
  const [delegationType, setDelegationType] = useState<DelegationType>(
    defaultDelegationType
  );
  const [estateType, setEstateType] = useState<EstateType>(defaultEstateType);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isDefault: boolean = !!delegationType.name && !!estateType.name;
  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);

  useEffect(() => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    estateService.current.setToken(state.token);
    locationService.current.setToken(state.token);

    loadOptions();
    loadLocations();
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  // useEffect(() => {
  //   loadData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [delegationType, estateType]);

  const loadLocations = async () => {
    locationService.current
      .getAllProvinces()
      .then((fetchedProvinces) => {
        setProvinces(fetchedProvinces);
        if (selectedProvince?.id) {
          const province = fetchedProvinces.find(
            (p) => p.id === selectedProvince.id
          );
          if (province) {
            setSelectedProvince({ ...province });
            setCities((prev) => province.cities);
            if (selectedCity?.id) {
              const city = province.cities.find(
                (c) => c.id === selectedCity.id
              );
              if (city) {
                setSelectedCity({ ...city });
                const neighborhoods = city.neighborhoods;
                setNeighborhoods((prev) => neighborhoods);
                if (selectedNeighborhood?.id) {
                  const neighborhood = neighborhoods.find(
                    (n) => n.id === selectedNeighborhood.id
                  );
                  if (neighborhood) {
                    setSelectedNeighborhood(neighborhood);
                  }
                }
              }
            }
          }
        }
      })
      .catch((_) => {
        toast.error(Strings.loadingLocationsFailed);
      });
  };

  async function loadOptions() {
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
        toast.error(Strings.loadingOptionsFailed);
      });
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

  function handleDelegationTypeChange(value: string) {
    setDelegationType({
      id: value,
      name: value,
    });
  }

  function handleEstateTypeChange(value: string) {
    setEstateType({
      id: value,
      name: value,
    });
  }

  function handleProvinceChange(provinceId: string) {
    const province = provinces.find((p) => p.id === provinceId);
    if (!province) return;

    setSelectedProvince({
      id: provinceId,
      name: provinceId,
      cities: province.cities,
      mapInfo: province.mapInfo,
    });
    setSelectedCity(defaultCity);
    setSelectedNeighborhood(defaultNeighborhood);
    setCities(province.cities);
  }

  function handleCityChange(cityId: string) {
    const city = cities.find((c) => c.id === cityId);

    if (!city) return;

    setSelectedCity({
      id: cityId,
      name: cityId,
      neighborhoods: city.neighborhoods,
      mapInfo: city.mapInfo,
    });
    setSelectedNeighborhood(defaultNeighborhood);
    setNeighborhoods(city.neighborhoods);
  }

  function handleNeighborhoodChange(neighborhoodId: string) {
    const neighborhood = neighborhoods.find((n) => n.id === neighborhoodId);

    if (!neighborhood) return;

    setSelectedNeighborhood({
      id: neighborhoodId,
      name: neighborhoodId,
      mapInfo: neighborhood.mapInfo,
    });
  }

  function submitFilter() {
    console.log("submit filter");
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
          <label htmlFor="provinceSelector">{Strings.province}</label>
          <Form.Select
            className="form-select rounded-3 ms-3"
            name="provinceSelector"
            id="provinceSelector"
            value={selectedProvince.name}
            onChange={(e) => handleProvinceChange(e.currentTarget.value)}
          >
            <option value="" disabled>
              {Strings.choose}
            </option>
            {provinces.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="citySelector">{Strings.city}</label>
          <Form.Select
            className="form-select rounded-3 ms-3"
            name="citySelector"
            id="citySelector"
            value={selectedCity.name}
            onChange={(e) => handleCityChange(e.currentTarget.value)}
          >
            <option value="" disabled>
              {Strings.choose}
            </option>
            {cities.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="neighborhoodSelector">{Strings.neighborhood}</label>
          <Form.Select
            className="form-select rounded-3 ms-3"
            name="neighborhoodSelector"
            id="neighborhoodSelector"
            value={selectedNeighborhood.name}
            onChange={(e) => handleNeighborhoodChange(e.currentTarget.value)}
          >
            <option value="" disabled>
              {Strings.choose}
            </option>
            {neighborhoods.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <label htmlFor="delegationType">{Strings.delegationType}</label>
          <Form.Select
            className="form-select rounded-3 ms-3"
            name="delegationType"
            id="delegationType"
            value={delegationType.name}
            onChange={(e) => handleDelegationTypeChange(e.currentTarget.value)}
          >
            <option value="" disabled>
              {Strings.choose}
            </option>
            {delegationTypes.map((option, index) => {
              return (
                <option key={index} value={option.id}>
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
            onChange={(e) => handleEstateTypeChange(e.currentTarget.value)}
          >
            <option value="" disabled>
              {Strings.choose}
            </option>
            {estateTypes.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Form.Select>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              submitFilter();
            }}
          >
            {Strings.submitFilter}
          </Button>
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
