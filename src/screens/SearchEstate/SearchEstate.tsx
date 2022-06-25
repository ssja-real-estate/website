import CustomModal from "components/CustomModal/CustomModal";
import EstateCard from "components/EstateCard/EstateCard";
import EstateInfoModal from "components/EstateInfoModal/EstateInfoModal";
import {
  estateInfoModalAtom,
  defaultEstateInfoModalState,
} from "components/EstateInfoModal/EstateInfoModalState";
import { motion } from "framer-motion";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City, { defaultCity } from "global/types/City";
import DelegationType, {
  defaultDelegationType,
} from "global/types/DelegationType";
import { defaultEstate, Estate } from "global/types/Estate";
import EstateType, { defaultEstateType } from "global/types/EstateType";
import SearchFilter from "global/types/Filter";
import Neighborhood, { defaultNeighborhood } from "global/types/Neighborhood";
import Province, { defaultProvince } from "global/types/Province";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import Tilt from "react-parallax-tilt";
import { useRecoilState, useRecoilValue } from "recoil";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateService from "services/api/EstateService/EstateService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import FormService from "services/api/FormService/FormService";
import LocationService from "services/api/LocationService/LocationService";
import SearchService from "services/api/SearchService/SearchService";
import { validateForm } from "services/utilities/fieldValidations";
import {
  crossfadeAnimation,
  elevationEffect,
} from "../../animations/motionVariants";
import { defaultForm, EstateForm } from "../../global/types/EstateForm";
import { Field, FieldType } from "../../global/types/Field";
import "./SearchEstate.css";

function SearchEstateScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingEstates, setLoadingEstates] = useState(false);
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
  const [selectedDelegationType, setSelectedDelegationType] =
    useState<DelegationType>(defaultDelegationType);
  const [selectedEstateType, setSelectedEstateType] =
    useState<EstateType>(defaultEstateType);
  const isDefault: boolean =
    !selectedDelegationType.name || !selectedEstateType.name ? true : false;
  const [isAdvancedFilter, toggleAdvancedFilter] = useState(true);
  const [noFilterExists, setNoFilterExists] = useState(false);
  const [dataForm, setDataForm] = useState<EstateForm>(defaultForm);
  const [estate, setEstate] = useState<Estate>(defaultEstate);
  const [searchedEstates, setSearchedEstates] = useState<Estate[]>([]);
  const [estateInfoModalState, setEstateInfoModalState] =
    useRecoilState(estateInfoModalAtom);

  const state = useRecoilValue(globalState);
  const searchService = useRef(new SearchService());
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);

  useEffect(() => {
    searchService.current.setToken(state.token);
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    estateService.current.setToken(state.token);
    locationService.current.setToken(state.token);

    loadLocations();
    loadOptions();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

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

  async function loadForm() {
    if (!loading) {
      setLoading((prev) => true);
    }

    if (!selectedDelegationType.id || !selectedEstateType.id) {
      setLoading((prev) => false);
      return;
    }
    const loadedForm = await searchService.current.getfilteredForm(
      selectedDelegationType.id,
      selectedEstateType.id
    );

    if (!loadedForm.id) {
      setNoFilterExists((prev) => true);
    } else {
      setDataForm(loadedForm);
    }
    setLoading((prev) => false);
  }

  function handleProvinceChange(provinceId: string) {
    const province = provinces.find((p) => p.id === provinceId);
    if (!province) {
      setSelectedProvince(defaultProvince);
      setSelectedCity(defaultCity);
      setCities([]);
      setSelectedNeighborhood(defaultNeighborhood);
      return;
    }

    setSelectedProvince({
      id: provinceId,
      name: provinceId,
      cities: province.cities,
      mapInfo: province.mapInfo,
    });
    setCities(province.cities);
    setSelectedCity(defaultCity);
    setSelectedNeighborhood(defaultNeighborhood);
  }

  function handleCityChange(cityId: string) {
    const city = cities.find((c) => c.id === cityId);

    if (!city) {
      setSelectedCity(defaultCity);
      setSelectedNeighborhood(defaultNeighborhood);
      setNeighborhoods([]);
      return;
    }

    setSelectedCity({
      id: cityId,
      name: cityId,
      neighborhoods: city.neighborhoods,
      mapInfo: city.mapInfo,
    });
    setNeighborhoods(city.neighborhoods);
    setSelectedNeighborhood(defaultNeighborhood);
  }

  function handleNeighborhoodChange(neighborhoodId: string) {
    const neighborhood = neighborhoods.find((n) => n.id === neighborhoodId);

    if (!neighborhood) {
      setSelectedNeighborhood(defaultNeighborhood);
      return;
    }

    setSelectedNeighborhood({
      id: neighborhoodId,
      name: neighborhoodId,
      mapInfo: neighborhood.mapInfo,
    });
  }

  function handleDelegationTypeChange(value: string) {
    setSelectedDelegationType({
      id: value,
      name: value,
    });
    setNoFilterExists((prev) => false);
  }

  function handleEstateTypeChange(value: string) {
    setSelectedEstateType({
      id: value,
      name: value,
    });
    setNoFilterExists((prev) => false);
  }

  function onFieldChange(
    targetValue: any,
    fieldIndex: number,
    min: boolean = false
  ) {
    const currentField = {
      ...dataForm.fields[fieldIndex],
    };
    if (currentField.type === FieldType.Range) {
      const value = +targetValue;
      let range = [currentField.min ?? 0, currentField.max ?? 0];
      if (min) range[0] = value;
      else range[1] = value;
      if (min) currentField.min = range[0];
      else currentField.max = range[1];
    } else {
      currentField.value = targetValue;
    }

    const fields = dataForm.fields;
    fields[fieldIndex] = currentField;

    setDataForm({
      ...dataForm,
      fields,
    });
  }

  function onConditionalFieldChange(
    targetValue: any,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm
  ) {
    const currentField = {
      ...form.fields[fieldIndex].fields![innerFieldIndex],
      value: targetValue,
    };
    const fields = form.fields;
    const innerFields = fields[fieldIndex].fields!;
    innerFields[innerFieldIndex] = currentField;
    fields[fieldIndex] = { ...fields[fieldIndex], fields: innerFields };
  }

  function mapFields(fields: Field[], form: EstateForm) {
    return fields.map((field, fieldIndex) => {
      return (
        <div key={fieldIndex} className="input-item py-3">
          <label className="mb-2">{field.title}</label>
          {field.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const stringValue = String(e.target.value);
                onFieldChange(stringValue, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Range ? (
            <div className="d-flex flex-row justify-content-evenly align-items-center ">
              <Form.Group>
                <Form.Label>{Strings.minValue}</Form.Label>
                <Form.Control
                  type="number"
                  value={field.min ?? ""}
                  onChange={(e: {
                    currentTarget: { value: string | number };
                  }) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex, true);
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{Strings.maxValue}</Form.Label>
                <Form.Control
                  type="number"
                  value={field.max ?? ""}
                  onChange={(e: {
                    currentTarget: { value: string | number };
                  }) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex);
                  }}
                ></Form.Control>
              </Form.Group>
            </div>
          ) : field.type === FieldType.Select ? (
            <Form.Select
              value={field.value ? String(field.value) : "default"}
              onChange={(e: { currentTarget: { value: any } }) => {
                const numberValue = String(e.currentTarget.value);
                onFieldChange(numberValue, fieldIndex);
              }}
            >
              <option value="default" disabled>
                {Strings.choose}
              </option>
              {field.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </Form.Select>
          ) : field.type === FieldType.Bool ? (
            <Form.Check
              className="d-inline mx-3"
              type="switch"
              checked={field.value ? true : false}
              onChange={(e: { target: { checked: any } }) => {
                const booleanValue = e.target.checked;
                onFieldChange(booleanValue, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Conditional ? (
            <>
              <Form.Check
                className="d-inline mx-3"
                type="switch"
                checked={field.value ? true : false}
                onChange={(e: { target: { checked: any } }) => {
                  const booleanValue = e.target.checked;
                  onFieldChange(booleanValue, fieldIndex);
                }}
              />
              {field.value &&
                !!field.fields &&
                mapConditionalFields(
                  field.fields!.filter((f) => f.filterable),
                  form,
                  fieldIndex
                )}
            </>
          ) : (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const stringValue = String(e.target.value);
                onFieldChange(stringValue, fieldIndex);
              }}
            />
          )}
        </div>
      );
    });
  }

  function mapConditionalFields(
    fields: Field[],
    form: EstateForm,
    fieldIndex: number
  ) {
    return fields.map((innerField, innerFieldIndex) => {
      return (
        <div key={innerFieldIndex} className="input-item py-3">
          <label className="mb-2">{innerField.title}</label>
          {innerField.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const stringValue = String(e.target.value);
                onConditionalFieldChange(
                  stringValue,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Number ? (
            <div className="d-flex flex-row justify-content-evenly align-items-center ">
              <Form.Group>
                <Form.Label>{Strings.minValue}</Form.Label>
                <Form.Control
                  type="number"
                  value={
                    (innerField.value as [number, number])
                      ? +(innerField.value as [number, number])[0]
                      : ""
                  }
                  onChange={(e: {
                    currentTarget: { value: string | number };
                  }) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex);
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{Strings.maxValue}</Form.Label>
                <Form.Control
                  type="number"
                  value={
                    (innerField.value as [number, number])
                      ? +(innerField.value as [number, number])[1]
                      : ""
                  }
                  onChange={(e: {
                    currentTarget: { value: string | number };
                  }) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex);
                  }}
                ></Form.Control>
              </Form.Group>
            </div>
          ) : innerField.type === FieldType.Select ? (
            <Form.Select
              value={innerField.value ? String(innerField.value) : "default"}
              onChange={(e: { currentTarget: { value: any } }) => {
                const numberValue = String(e.currentTarget.value);
                onConditionalFieldChange(
                  numberValue,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            >
              <option value="default" disabled>
                {Strings.choose}
              </option>
              {innerField.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </Form.Select>
          ) : innerField.type === FieldType.Bool ? (
            <Form.Check
              className="d-inline mx-3"
              type="switch"
              checked={innerField.value ? true : false}
              onChange={(e: { target: { checked: any } }) => {
                const booleanValue = e.target.checked;
                onConditionalFieldChange(
                  booleanValue,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Conditional ? (
            <>
              <Form.Check
                className="d-inline mx-3"
                type="switch"
                checked={innerField.value ? true : false}
                onChange={(e: { target: { checked: any } }) => {
                  const booleanValue = e.target.checked;
                  onConditionalFieldChange(
                    booleanValue,
                    fieldIndex,
                    innerFieldIndex,
                    form
                  );
                }}
              />
              {innerField.value &&
                mapConditionalFields(innerField.fields!, form, fieldIndex)}
            </>
          ) : (
            <Form.Control
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const stringValue = String(e.target.value);
                onConditionalFieldChange(
                  stringValue,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          )}
        </div>
      );
    });
  }

  function clearStates() {
    setSelectedDelegationType(defaultDelegationType);
    setSelectedEstateType(defaultEstateType);
    setDataForm(defaultForm);
    setEstate(defaultEstate);
  }

  async function handleAdvancedFilter() {
    if (isDefault) {
      toast.error(Strings.chooseDelegationAndEstateTypes);
      return;
    }

    if (!isAdvancedFilter) {
      clearStates();
      toggleAdvancedFilter(!isAdvancedFilter);
      setNoFilterExists(false);
      return;
    }

    loadForm();
    if (!noFilterExists) return;
    toggleAdvancedFilter(!isAdvancedFilter);
  }

  function buildFilter() {
    let filter: SearchFilter = {
      header: {
        assignmentTypeId: selectedDelegationType.id,
        estateTypeId: selectedEstateType.id,
        provinceId: selectedProvince.id,
        cityId: selectedCity.id,
        neighbordhoodId: selectedNeighborhood.id,
      },
      form: dataForm.id ? dataForm : undefined,
    };

    return filter;
  }

  async function searchEstate() {
    const errors = validateForm(dataForm);
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        toast.error(error.message, {
          duration: 3000,
        });
      }
      return;
    }

    setLoadingEstates((prev) => true);

    const filter = buildFilter();
    const fetchedEstates = await searchService.current.searchEstates(filter);

    setSearchedEstates(fetchedEstates);
    setLoadingEstates((prev) => false);
  }

  return (
    <Row className="main-row">
      <Col>
        <div className="main-container">
          <div className="search-estate-container">
            <motion.div
              variants={elevationEffect}
              initial="first"
              animate="second"
              className="search-estate card glass shadow rounded-3 py-3 my-4"
            >
              <h2 className="search-estate-title text-center">
                {Strings.searchEstate}
              </h2>
              <form className="search-estate-form">
                <label htmlFor="province">{Strings.province}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="province"
                  id="province"
                  value={selectedProvince?.name}
                  onChange={(e: { currentTarget: { value: string } }) =>
                    handleProvinceChange(e.currentTarget.value)
                  }
                >
                  <option value="">{Strings.choose}</option>
                  {provinces.map((province, index) => {
                    return (
                      <option key={index} value={province.id}>
                        {province.name}
                      </option>
                    );
                  })}
                </Form.Select>
                <label htmlFor="city">{Strings.city}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="city"
                  id="city"
                  value={selectedCity?.name}
                  onChange={(e: { currentTarget: { value: string } }) =>
                    handleCityChange(e.currentTarget.value)
                  }
                >
                  <option value="">{Strings.choose}</option>
                  {cities.map((city, index) => {
                    return (
                      <option key={index} value={city.id}>
                        {city.name}
                      </option>
                    );
                  })}
                </Form.Select>
                <label htmlFor="neighborhood">{Strings.neighborhood}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="neighborhood"
                  id="neighborhood"
                  value={selectedNeighborhood?.name}
                  onChange={(e: { currentTarget: { value: string } }) =>
                    handleNeighborhoodChange(e.currentTarget.value)
                  }
                >
                  <option value="">{Strings.choose}</option>
                  {neighborhoods.map((neighborhood, index) => {
                    return (
                      <option key={index} value={neighborhood.id}>
                        {neighborhood.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </form>
              <form className="search-estate-form mt-2">
                <label htmlFor="delegationType">{Strings.delegationType}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="delegationType"
                  id="delegationType"
                  value={selectedDelegationType.name}
                  onChange={(e: { currentTarget: { value: string } }) =>
                    handleDelegationTypeChange(e.currentTarget.value)
                  }
                  disabled={!isAdvancedFilter}
                >
                  <option value="">{Strings.choose}</option>
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
                  value={selectedEstateType.name}
                  onChange={(e: { currentTarget: { value: string } }) =>
                    handleEstateTypeChange(e.currentTarget.value)
                  }
                  disabled={!isAdvancedFilter}
                >
                  <option value="">{Strings.choose}</option>
                  {estateTypes.map((option, index) => {
                    return (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </form>
            </motion.div>
            {loading ? (
              <Row>
                <Col>
                  <Spinner
                    animation="border"
                    variant="primary"
                    className="my-5"
                  />
                </Col>
              </Row>
            ) : (
              <div className="items-container">
                <div className="section card glass shadow-sm py-2 px-4 my-2">
                  {mapFields(estate.dataForm.fields, estate.dataForm)}
                </div>
                {noFilterExists ? (
                  <motion.div
                    variants={crossfadeAnimation}
                    initial="first"
                    animate="second"
                    className="card glass shadow rounded-3 glass p-5 align-items-center"
                  >
                    <h4 className="fw-light">{Strings.noFilterForThisForm}</h4>
                  </motion.div>
                ) : null}
              </div>
            )}
            <Row className=" m-3">
              <Col xl="6">
                <Button
                  className="btn-search-normal"
                  variant="purple"
                  onClick={searchEstate}
                >
                  {isAdvancedFilter
                    ? Strings.normalSearch
                    : Strings.submitFilter}
                </Button>
              </Col>
              <Col xl="6">
                <Button
                  className="btn-search-advanced"
                  variant="purple"
                  onClick={handleAdvancedFilter}
                >
                  {isAdvancedFilter
                    ? Strings.advancedFilter
                    : Strings.clearAdvancedFilter}
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col>
        <div className="estates-container shadow-lg rounded-3 min-vh-100">
          {
            <Container>
              <motion.div
                variants={crossfadeAnimation}
                initial="first"
                animate="second"
                className="estates-grid"
              >
                {loadingEstates
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
                  : searchedEstates.map((estate, index) => {
                      return (
                        <React.Fragment key={index}>
                          <EstateCard
                            estate={estate}
                            showEstateInfoButton
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
              </motion.div>
            </Container>
          }
        </div>
      </Col>

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
    </Row>
  );
}

export default SearchEstateScreen;
