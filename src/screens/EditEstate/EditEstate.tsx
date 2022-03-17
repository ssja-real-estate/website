import { motion } from "framer-motion";
import Strings from "global/constants/strings";
import { estateScreenAtom, ScreenType } from "global/states/EstateScreen";
import { imagesBaseUrl } from "global/states/GlobalState";
import { globalState } from "global/states/globalStates";
import City, { defaultCity } from "global/types/City";
import DelegationType, {
  defaultDelegationType,
} from "global/types/DelegationType";
import { defaultEstate, Estate } from "global/types/Estate";
import EstateType, { defaultEstateType } from "global/types/EstateType";
import MapInfo from "global/types/MapInfo";
import Neighborhood, { defaultNeighborhood } from "global/types/Neighborhood";
import Province, { defaultProvince } from "global/types/Province";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import MapScreen from "screens/Map/Map";
import DelegationTypeService from "services/api/DelegationTypeService/DelegationTypeService";
import EstateService from "services/api/EstateService/EstateService";
import EstateTypeService from "services/api/EstateTypeService/EstateTypeService";
import FormService from "services/api/FormService/FormService";
import LocationService from "services/api/LocationService/LocationService";
import { validateForm } from "services/utilities/fieldValidations";
import {
  crossfadeAnimation,
  elevationEffect,
} from "../../animations/motionVariants";
import { defaultForm, EstateForm } from "../../global/types/EstateForm";
import { Field, FieldType } from "../../global/types/Field";
import "./EditEstate.css";

function EditEstateScreen() {
  const { inputEstate, screenType } = useRecoilValue(estateScreenAtom);
  const [loading, setLoading] = useState<boolean>(true);
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
  const [estate, setEstate] = useState<Estate>(defaultEstate);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [imagesCount, setImagesCount] = useState<number>(0);
  const [previousImages, setPreviousImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const [mapInfo, setMapInfo] = useState<MapInfo>();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setServinceTokens();
    loadLocations();
    // if (screenType === ScreenType.Add) {
    //   loadOptions();
    // }
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDelegationType, selectedEstateType, state.token, reload]);

  useEffect(() => {
    if (screenType === ScreenType.Edit) {
      loadLocations();
      loadOptions();
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenType]);

  const setServinceTokens = () => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    estateService.current.setToken(state.token);
    locationService.current.setToken(state.token);
  };

  async function loadLocations() {
    locationService.current
      .getAllProvinces()
      .then((fetchedProvinces) => {
        setProvinces(fetchedProvinces);
        let locationIds = undefined;
        if (screenType === ScreenType.Add) {
          locationIds = {
            provinceId: selectedProvince.id,
            cityId: selectedCity.id,
            neighborhoodId: selectedNeighborhood.id,
          };
        } else {
          if (!inputEstate || !inputEstate.id) return;
          locationIds = {
            provinceId: inputEstate.province.id,
            cityId: inputEstate.city.id,
            neighborhoodId: inputEstate.neighborhood.id,
          };
        }
        if (!locationIds) return;
        setLocationValues(fetchedProvinces, locationIds);
      })
      .catch((_) => {
        toast.error(Strings.loadingLocationsFailed);
      });
  }

  function setLocationValues(
    fetchedProvinces: Province[],
    locationIds: {
      provinceId?: string;
      cityId?: string;
      neighborhoodId?: string;
    }
  ) {
    const { provinceId, cityId, neighborhoodId } = locationIds;
    if (!provinceId) return;
    const province = fetchedProvinces.find((p) => p.id === provinceId);
    if (!province) return;
    setSelectedProvince(province);

    setCities((prev) => province.cities);
    if (!cityId) return;
    const city = province.cities.find((c) => c.id === cityId);
    if (!city) return;
    setSelectedCity(city);

    setNeighborhoods((prev) => city.neighborhoods);
    if (!neighborhoodId) return;
    const neighborhood = city.neighborhoods.find(
      (n) => n.id === neighborhoodId
    );
    if (!neighborhood) return;
    setSelectedNeighborhood(neighborhood);
    setMapInfo(neighborhood.mapInfo);
  }

  async function loadOptions() {
    let fetchedDelegationTypes: DelegationType[] = [];
    let fetchedEstateTypes: EstateType[] = [];
    delegationTypeService.current
      .getAllDelegationTypes()
      .then((types) => {
        setDelegationTypes(types);
        fetchedDelegationTypes = types;
      })
      .then(() => estateTypeService.current.getAllEstateTypes())
      .then((types) => {
        setEstateTypes(types);
        fetchedEstateTypes = types;
      })
      .then(() => {
        let ids = {
          delegationTypeId:
            screenType === ScreenType.Add
              ? selectedDelegationType.id
              : inputEstate.dataForm.assignmentTypeId,
          estateTypeId:
            screenType === ScreenType.Add
              ? selectedEstateType.id
              : inputEstate.dataForm.estateTypeId,
        };
        setOptions({ fetchedDelegationTypes, fetchedEstateTypes }, ids);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function setOptions(
    options: {
      fetchedDelegationTypes: DelegationType[];
      fetchedEstateTypes: EstateType[];
    },
    ids: { delegationTypeId?: string; estateTypeId?: string }
  ) {
    const { fetchedDelegationTypes, fetchedEstateTypes } = options;
    const { delegationTypeId, estateTypeId } = ids;
    if (fetchedDelegationTypes) {
      if (delegationTypeId) {
        const type = fetchedDelegationTypes.find(
          (d) => d.id === delegationTypeId
        );
        if (type) {
          setSelectedDelegationType(type);
        }
      }
    }
    if (fetchedEstateTypes) {
      if (estateTypeId) {
        const type = fetchedEstateTypes.find((e) => e.id === estateTypeId);
        if (type) {
          setSelectedEstateType(type);
        }
      }
    }
  }

  async function loadData() {
    if (!loading) {
      setLoading((prev) => true);
    }

    if (!selectedDelegationType.id || !selectedEstateType.id) {
      setLoading((prev) => false);
      return;
    }

    let loadedEstate: Estate = { ...estate, dataForm: defaultForm };
    if (screenType === ScreenType.Add) {
      loadedEstate.dataForm = await formService.current.getForm(
        selectedDelegationType.id,
        selectedEstateType.id
      );
    } else {
      if (inputEstate && inputEstate.id) {
        loadedEstate = JSON.parse(JSON.stringify(inputEstate));
      }
    }
    setEstate(loadedEstate);
    setImages(loadedEstate.dataForm);
    setLoading((prev) => false);
  }

  function setImages(form: EstateForm) {
    if (!form.sections || form.sections.length < 1) return;

    const firstSection = form.sections[0];
    if (!firstSection.fields || firstSection.fields.length < 1) return;

    const firstField = firstSection.fields[0];
    if (firstField.type !== FieldType.Image) return;

    setPreviousImages((firstField.value as string[]) ?? []);
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
    setMapInfo(province.mapInfo);
    setCities(province.cities);
    setEstate({
      ...estate,
      province: {
        id: provinceId,
        name: province.name,
      },
    });
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
    setMapInfo(city.mapInfo);
    setNeighborhoods(city.neighborhoods);

    setEstate({
      ...estate,
      city: {
        id: cityId,
        name: city.name,
      },
    });
  }

  function handleNeighborhoodChange(neighborhoodId: string) {
    const neighborhood = neighborhoods.find((n) => n.id === neighborhoodId);
    if (!neighborhood) return;

    setSelectedNeighborhood({
      id: neighborhoodId,
      name: neighborhoodId,
      mapInfo: neighborhood.mapInfo,
    });
    setMapInfo(neighborhood.mapInfo);
    setEstate({
      ...estate,
      neighborhood: {
        id: neighborhoodId,
        name: neighborhood.name,
      },
    });
  }

  function checkFileSizes(files: File[]): boolean {
    const sumOfFileSizes = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    return sumOfFileSizes > 2048;
  }

  function onFieldChange(
    targetValue: any,
    // form: EstateForm,
    sectionIndex: number,
    fieldIndex: number
  ) {
    let currentField = {
      ...estate.dataForm.sections[sectionIndex].fields[fieldIndex],
      value: targetValue,
    };
    let sections = [...estate.dataForm.sections];
    let fields = sections[sectionIndex].fields;
    fields[fieldIndex] = { ...currentField };
    // fields[fieldIndex] = { ...fields[fieldIndex], value: targetValue };
    sections[sectionIndex].fields = fields;

    setEstate({
      ...estate,
      dataForm: {
        ...estate.dataForm,
        sections: sections,
      },
    });
  }

  function onConditionalFieldChange(
    targetValue: any,
    sectionIndex: number,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm
  ) {
    const currentField = {
      ...form.sections[sectionIndex].fields[fieldIndex].fields![
        innerFieldIndex
      ],
      value: targetValue,
    };
    const sections = form.sections;
    const fields = sections[sectionIndex].fields;
    const innerFields = fields[fieldIndex].fields!;
    innerFields[innerFieldIndex] = currentField;
    fields[fieldIndex] = { ...fields[fieldIndex], fields: innerFields };
    sections[sectionIndex].fields = fields;

    setEstate({
      ...estate,
      dataForm: {
        ...form,
        sections: sections,
      },
    });
  }

  function mapFields(fields: Field[], form: EstateForm, sectionIndex: number) {
    return fields.map((field, fieldIndex) => {
      return (
        <div key={fieldIndex} className="input-item py-3">
          <label>
            {field.title} {field.optional ? Strings.optionalField : null}
          </label>
          {field.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);
                onFieldChange(stringValue, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Number ? (
            <Form.Control
              type="number"
              value={field.value ? Number(field.value) : ""}
              onChange={(e) => {
                const numberValue = Number(e.target.value);

                onFieldChange(numberValue, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Select ? (
            <Form.Select
              value={field.value ? String(field.value) : "default"}
              onChange={(e) => {
                const numberValue = String(e.currentTarget.value);

                onFieldChange(numberValue, sectionIndex, fieldIndex);
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
              onChange={(e) => {
                const booleanValue = e.target.checked;
                onFieldChange(booleanValue, sectionIndex, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Conditional ? (
            <>
              <Form.Check
                className="d-inline mx-3"
                type="switch"
                checked={field.value ? true : false}
                onChange={(e) => {
                  const booleanValue = e.target.checked;
                  onFieldChange(booleanValue, sectionIndex, fieldIndex);
                }}
              />
              {field.value &&
                mapConditionalFields(
                  field.fields!,
                  form,
                  sectionIndex,
                  fieldIndex
                )}
            </>
          ) : field.type === FieldType.Image ? (
            <Row>
              {previousImages.length > 0
                ? previousImages.map((img, idx) => (
                    <Col>
                      <div key={idx}>
                        <img
                          src={`${imagesBaseUrl}/${img}`}
                          alt={`${imagesBaseUrl}/${img}`}
                          className="thumbnail rounded-3"
                        />
                        <button
                          className="btn-remove"
                          onClick={() => {
                            let filteredImages = previousImages.filter(
                              (i) => i !== img
                            );
                            setPreviousImages(filteredImages);
                            setDeletedImages((prev) => [...prev, img]);
                          }}
                        >
                          X
                        </button>
                      </div>
                    </Col>
                  ))
                : null}
              <Form.Control
                type="file"
                multiple
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  let selectedFiles = Array.from(e.target.files!);
                  setImagesCount(selectedFiles.length);

                  if (!checkFileSizes(selectedFiles)) {
                    alert(Strings.imagesSizeLimit);
                    e.target.value = "";
                    selectedFiles = [];
                  }

                  const data = new FormData();
                  selectedFiles.forEach((file, index) => {
                    data.append("images", file);
                  });
                  setFormData(data);
                  // onFieldChange(data, form, sectionIndex, fieldIndex);
                }}
              />
            </Row>
          ) : (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);
                onFieldChange(stringValue, sectionIndex, fieldIndex);
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
    sectionIndex: number,
    fieldIndex: number
  ) {
    return fields.map((innerField, innerFieldIndex) => {
      return (
        <div key={innerFieldIndex} className="input-item py-3">
          <label>
            {innerField.title}{" "}
            {innerField.optional ? Strings.optionalField : null}
          </label>
          {innerField.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onConditionalFieldChange(
                  stringValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Number ? (
            <Form.Control
              type="number"
              value={innerField.value ? Number(innerField.value) : ""}
              onChange={(e) => {
                const numberValue = Number(e.target.value);

                onConditionalFieldChange(
                  numberValue,
                  sectionIndex,
                  fieldIndex,
                  innerFieldIndex,
                  form
                );
              }}
            />
          ) : innerField.type === FieldType.Select ? (
            <Form.Select
              value={innerField.value ? String(innerField.value) : "default"}
              onChange={(e) => {
                const numberValue = String(e.currentTarget.value);

                onConditionalFieldChange(
                  numberValue,
                  sectionIndex,
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
              onChange={(e) => {
                const booleanValue = e.target.checked;

                onConditionalFieldChange(
                  booleanValue,
                  sectionIndex,
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
                onChange={(e) => {
                  const booleanValue = e.target.checked;

                  onConditionalFieldChange(
                    booleanValue,
                    sectionIndex,
                    fieldIndex,
                    innerFieldIndex,
                    form
                  );
                }}
              />
              {innerField.value &&
                mapConditionalFields(
                  innerField.fields!,
                  form,
                  sectionIndex,
                  fieldIndex
                )}
            </>
          ) : innerField.type === FieldType.Image ? (
            <Form.Control
              type="file"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let selectedFiles = Array.from(e.target.files!);
                setImagesCount(selectedFiles.length);

                if (!checkFileSizes(selectedFiles)) {
                  alert(Strings.imagesSizeLimit);
                  e.target.value = "";
                  selectedFiles = [];
                }

                const data = new FormData();
                selectedFiles.forEach((file, index) => {
                  data.append("images", file);
                });

                setFormData(data);

                // onFieldChange(data, form, sectionIndex, fieldIndex);
              }}
            />
          ) : (
            <Form.Control
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onConditionalFieldChange(
                  stringValue,
                  sectionIndex,
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

  async function submitEstate() {
    if (!selectedProvince.id || !selectedCity.id || !selectedNeighborhood.id) {
      toast.error(Strings.enterlocationInfo);
      return;
    }

    if (imagesCount + previousImages.length > 10) {
      toast.error(Strings.imagesLimit);
      return;
    }

    const errors = validateForm(estate.dataForm);
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        toast.error(error.message, {
          duration: 2000,
        });
      }
      return;
    }

    setLoading((prev) => true);

    let response: Estate | undefined;

    formData.append("estate", JSON.stringify(estate));
    formData.append("deletedImages", JSON.stringify(deletedImages));
    if (screenType === ScreenType.Add) {
      response = await estateService.current.requestAddEtate(formData);
    } else {
      response = await estateService.current.editEstate(estate.id, formData);
    }

    if (response) {
      // toast.success(Strings.addEstateRequestSuccess, {
      //   duration: 5000,
      // });
      // setSelectedProvince(defaultProvince);
      // setSelectedCity(defaultCity);
      // setSelectedNeighborhood(defaultNeighborhood);
      // setSelectedDelegationType(defaultDelegationType);
      // setSelectedEstateType(defaultEstateType);
      // setFormData(new FormData());
      // setEstate(defaultEstate);
      setReload(!reload);
    }
    setLoading((prev) => false);
  }

  return (
    <Row className="main-row">
      <Col>
        <div className="main-container">
          <div className="edit-estate-container">
            <motion.div
              variants={elevationEffect}
              initial="first"
              animate="second"
              className="edit-estate card glass shadow rounded-3 py-3 my-4"
            >
              <h2 className="edit-estate-title text-center">
                {screenType === ScreenType.Add
                  ? Strings.addEstate
                  : Strings.editEstate}
              </h2>
              <form className="edit-estate-form">
                <label htmlFor="province">{Strings.province}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="province"
                  id="province"
                  value={selectedProvince?.name}
                  onChange={(e) => handleProvinceChange(e.currentTarget.value)}
                >
                  <option value="" disabled>
                    {Strings.choose}
                  </option>
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
                  onChange={(e) => handleCityChange(e.currentTarget.value)}
                >
                  <option value="" disabled>
                    {Strings.choose}
                  </option>
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
                  onChange={(e) =>
                    handleNeighborhoodChange(e.currentTarget.value)
                  }
                >
                  <option value="" disabled>
                    {Strings.choose}
                  </option>
                  {neighborhoods.map((neighborhood, index) => {
                    return (
                      <option key={index} value={neighborhood.id}>
                        {neighborhood.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </form>
              <form className="edit-estate-form mt-2">
                <label htmlFor="delegationType">{Strings.delegationType}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="delegationType"
                  id="delegationType"
                  value={selectedDelegationType.name}
                  disabled={true}
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
                  value={selectedEstateType.name}
                  disabled={true}
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
              </form>
            </motion.div>
            {isDefault ? (
              <motion.div
                variants={crossfadeAnimation}
                initial="first"
                animate="second"
                className="card glass shadow rounded-3 glass p-5"
              >
                <h4 className="fw-light fs-4">
                  {Strings.chooseDelegationAndEstateTypes}
                </h4>
              </motion.div>
            ) : loading ? (
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
                {estate.dataForm.sections.map((section, sectionIndex) => {
                  return (
                    <div
                      className="section card glass shadow-sm py-2 px-4 my-2"
                      key={sectionIndex}
                    >
                      <h3 className="section-title py-3">{section.title}</h3>
                      {mapFields(section.fields, estate.dataForm, sectionIndex)}
                    </div>
                  );
                })}
                {!estate.dataForm.id ? (
                  <motion.div
                    variants={crossfadeAnimation}
                    initial="first"
                    animate="second"
                    className="card glass shadow rounded-3 glass p-5 align-items-center"
                  >
                    <h4 className="fw-light">{Strings.formDoesNotExist}</h4>
                  </motion.div>
                ) : (
                  <Button
                    className="w-100 mb-5 mt-3"
                    variant="purple"
                    onClick={submitEstate}
                  >
                    {Strings.addEstate}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Col>
      <Col>
        <div className="map-container shadow-lg rounded-3">
          <MapScreen
            latLang={
              mapInfo
                ? { lat: mapInfo.latitude, lng: mapInfo.longitude }
                : undefined
            }
            zoom={mapInfo?.zoom}
          />
        </div>
      </Col>
    </Row>
  );
}

export default EditEstateScreen;
