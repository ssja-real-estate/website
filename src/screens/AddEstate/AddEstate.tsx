import { motion } from "framer-motion";
import Strings from "global/constants/strings";
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
import { v4 } from "uuid";
import {
  crossfadeAnimation,
  elevationEffect,
} from "../../animations/motionVariants";
import { EstateForm } from "../../global/types/EstateForm";
import { Field, FieldType } from "../../global/types/Field";
import "./AddEstate.css";

function AddEstateScreen() {
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

  const state = useRecoilValue(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const [mapInfo, setMapInfo] = useState<MapInfo>();

  useEffect(() => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    estateService.current.setToken(state.token);
    locationService.current.setToken(state.token);

    loadLocations();
    loadOptions();
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDelegationType, selectedEstateType, state.token]);

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

    if (!selectedDelegationType.id || !selectedEstateType.id) {
      setLoading((prev) => false);
      return;
    }
    const loadedForm = await formService.current.getForm(
      selectedDelegationType.id,
      selectedEstateType.id
    );

    setEstate({ ...estate, dataForm: loadedForm });
    await loadLocations();
    await loadOptions();
    setLoading((prev) => false);
  }

  function handleProvinceChange(event: ChangeEvent<HTMLSelectElement>) {
    const provinceId = event.currentTarget.value;
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

  function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
    const cityId = event.currentTarget.value;
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

  function handleNeighborhoodChange(event: ChangeEvent<HTMLSelectElement>) {
    const neighborhoodId = event.currentTarget.value;

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

  function handleDelegationChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedDelegationType({
      id: event.currentTarget.value,
      name: event.currentTarget.value,
    });
  }
  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedEstateType({
      id: event.currentTarget.value,
      name: event.currentTarget.value,
    });
  }

  function checkFileSizes(files: File[]): boolean {
    const sumOfFileSizes = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    return sumOfFileSizes > 2048;
  }

  function onFieldChange(
    targetValue: any,
    form: EstateForm,
    fieldIndex: number,
    key?: string
  ) {
    const currentField = {
      ...form.fields[fieldIndex],
    };

    if (currentField.type === FieldType.MultiSelect) {
      const fieldValue = currentField.value as { [key: string]: boolean };
      if (key && fieldValue) {
        fieldValue[key] = targetValue;
        currentField.value = fieldValue;
      }
    } else {
      currentField.value = targetValue;
    }

    const fields = form.fields;
    fields[fieldIndex] = currentField;

    setEstate({
      ...estate,
      dataForm: {
        ...form,
        fields: fields,
      },
    });
  }

  function onSelectiveConditionalFieldChange(
    targetValue: any,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm,
    selectiveKey: string
  ) {
    const fieldMaps = form.fields[fieldIndex].fieldMaps ?? [];
    const selectiveFieldMapIndex = fieldMaps.findIndex(
      (f) => f.key === selectiveKey
    );
    const selectiveFields =
      fieldMaps.find((f) => f.key === selectiveKey)?.fields ?? [];
    if (selectiveFields.length < innerFieldIndex + 1) return;

    const currentField = {
      ...selectiveFields[innerFieldIndex],
      value: targetValue,
    };

    selectiveFields[innerFieldIndex] = currentField;
    if (selectiveFieldMapIndex !== -1) {
      fieldMaps[selectiveFieldMapIndex].fields = selectiveFields;
    }
    const fields = form.fields;
    fields[fieldIndex] = { ...fields[fieldIndex], fieldMaps };

    setEstate({
      ...estate,
      dataForm: {
        ...form,
        fields,
      },
    });
  }

  function onConditionalFieldChange(
    targetValue: any,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm,
    selectiveKey?: string
  ) {
    const field = form.fields[fieldIndex];
    if (!field) return;
    if (field.type === FieldType.SelectiveConditional) {
      onSelectiveConditionalFieldChange(
        targetValue,
        fieldIndex,
        innerFieldIndex,
        form,
        selectiveKey!
      );
      return;
    }
    const currentField = {
      ...form.fields[fieldIndex].fields![innerFieldIndex],
      value: targetValue,
    };
    const fields = form.fields;
    const innerFields = fields[fieldIndex].fields!;
    innerFields[innerFieldIndex] = currentField;
    fields[fieldIndex] = { ...fields[fieldIndex], fields: innerFields };

    setEstate({
      ...estate,
      dataForm: {
        ...form,
        fields,
      },
    });
  }

  function mapFields(fields: Field[], form: EstateForm) {
    return fields.map((field, fieldIndex) => {
      return (
        <div key={fieldIndex} className="input-item py-3">
          <label>
            {field.title} {field.optional ? Strings.optionalField : ""}
          </label>
          {field.type === FieldType.Text ? (
            <Form.Control
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const stringValue = String(e.target.value);
                onFieldChange(stringValue, form, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Number ? (
            <Form.Control
              type="number"
              value={field.value ? Number(field.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const numberValue = Number(e.target.value);

                onFieldChange(numberValue, form, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Select ? (
            <Form.Select
              value={field.value ? String(field.value) : "default"}
              onChange={(e: { currentTarget: { value: any } }) => {
                const numberValue = String(e.currentTarget.value);

                onFieldChange(numberValue, form, fieldIndex);
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
              type="checkbox"
              checked={field.value ? true : false}
              onChange={(e: { target: { checked: any } }) => {
                const booleanValue = e.target.checked;
                onFieldChange(booleanValue, form, fieldIndex);
              }}
            />
          ) : field.type === FieldType.BooleanConditional ? (
            <>
              <Form.Check
                className="d-inline  mx-3"
                type="checkbox"
                disabled={false}
                checked={field.value ? true : false}
                onChange={(e: { target: { checked: any } }) => {
                  const booleanValue = e.target.checked;

                  onFieldChange(booleanValue, form, fieldIndex);
                }}
              />
              {field.value &&
                mapConditionalFields(field.fields!, form, fieldIndex)}
            </>
          ) : field.type === FieldType.Image ? (
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
              }}
            />
          ) : field.type === FieldType.SelectiveConditional ? (
            <>
              <Form.Select
                value={field.value ? String(field.value) : "default"}
                onChange={(e: { currentTarget: { value: any } }) => {
                  const selectValue = String(e.currentTarget.value);
                  onFieldChange(selectValue, form, fieldIndex);
                }}
              >
                <option value="default" disabled>
                  {Strings.choose}
                </option>
                {field.options?.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
              </Form.Select>
              {field.value &&
                mapConditionalFields(
                  field.fieldMaps?.find((f) => f.key === field.value)?.fields ??
                    [],
                  form,
                  fieldIndex,
                  field.value as string
                )}
            </>
          ) : field.type === FieldType.MultiSelect ? (
            <>
              {field.keys!.map((key) => {
                // const keyMap = field.value as { [key: string]: boolean };
                return (
                  <div className="d-block" key={v4()}>
                    <label>{key}</label>
                    <Form.Check
                      className="d-inline mx-3"
                      type="checkbox"
                      disabled={false}
                      checked={(field.value as { [key: string]: boolean })[key]}
                      onChange={(e: { target: { checked: any } }) => {
                        const booleanValue = e.target.checked;
                        onFieldChange(booleanValue, form, fieldIndex, key);
                      }}
                    />
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      );
    });
  }

  function mapConditionalFields(
    fields: Field[],
    form: EstateForm,
    fieldIndex: number,
    selectiveKey?: string
  ) {
    return fields.map((innerField, innerFieldIndex) => {
      return (
        <div key={innerFieldIndex} className="input-item py-3">
          <label>
            {`${innerField.title} ${
              innerField.optional ? Strings.optionalField : ""
            }`}
          </label>
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
                  form,
                  selectiveKey
                );
              }}
            />
          ) : innerField.type === FieldType.Number ? (
            <Form.Control
              type="number"
              value={innerField.value ? Number(innerField.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const numberValue = Number(e.target.value);

                onConditionalFieldChange(
                  numberValue,
                  fieldIndex,
                  innerFieldIndex,
                  form,
                  selectiveKey
                );
              }}
            />
          ) : innerField.type === FieldType.Select ? (
            <Form.Select
              value={innerField.value ? String(innerField.value) : "default"}
              onChange={(e: { currentTarget: { value: any } }) => {
                const numberValue = String(e.currentTarget.value);

                onConditionalFieldChange(
                  numberValue,
                  fieldIndex,
                  innerFieldIndex,
                  form,
                  selectiveKey
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
              type="checkbox"
              checked={innerField.value ? true : false}
              onChange={(e: { target: { checked: any } }) => {
                const booleanValue = e.target.checked;

                onConditionalFieldChange(
                  booleanValue,
                  fieldIndex,
                  innerFieldIndex,
                  form,
                  selectiveKey
                );
              }}
            />
          ) : innerField.type === FieldType.BooleanConditional ? (
            <>
              <Form.Check
                className="d-inline mx-3"
                type="checkbox"
                checked={innerField.value ? true : false}
                onChange={(e: { target: { checked: any } }) => {
                  const booleanValue = e.target.checked;

                  onConditionalFieldChange(
                    booleanValue,
                    fieldIndex,
                    innerFieldIndex,
                    form,
                    selectiveKey
                  );
                }}
              />
              {innerField.value &&
                mapConditionalFields(
                  innerField.fields!,
                  form,
                  fieldIndex,
                  selectiveKey
                )}
            </>
          ) : null}
        </div>
      );
    });
  }

  async function submitEstate() {
    if (!selectedProvince.id || !selectedCity.id || !selectedNeighborhood.id) {
      toast.error(Strings.enterlocationInfo);
      return;
    }

    if (imagesCount > 10) {
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

    formData.append("estate", JSON.stringify(estate));
    let response = await estateService.current.requestAddEtate(formData);

    if (response) {
      toast.success(Strings.addEstateRequestSuccess, {
        duration: 5000,
      });
      setSelectedProvince(defaultProvince);
      setSelectedCity(defaultCity);
      setSelectedNeighborhood(defaultNeighborhood);
      setSelectedDelegationType(defaultDelegationType);
      setSelectedEstateType(defaultEstateType);
      setFormData(new FormData());
      setEstate(defaultEstate);
    }
    setLoading((prev) => false);
  }

  return (
    <Row className="main-row">
      <Col>
        <div className="main-container">
          <div className="add-estate-container">
            <motion.div
              variants={elevationEffect}
              initial="first"
              animate="second"
              className="add-estate card glass shadow rounded-3 py-3 my-4"
            >
              <h2 className="add-estate-title text-center">
                {Strings.addEstate}
              </h2>
              <form className="add-estate-form">
                <label htmlFor="province">{Strings.province}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="province"
                  id="province"
                  value={selectedProvince?.name}
                  onChange={handleProvinceChange}
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
                  onChange={handleCityChange}
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
                  onChange={handleNeighborhoodChange}
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
              <form className="add-estate-form mt-2">
                <label htmlFor="delegationType">{Strings.delegationType}</label>
                <Form.Select
                  className="form-select rounded-3"
                  name="delegationType"
                  id="delegationType"
                  value={selectedDelegationType.name}
                  onChange={handleDelegationChange}
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
                  onChange={handleTypeChange}
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
                <div className="section card glass shadow-sm py-2 px-4 my-2">
                  {mapFields(estate.dataForm.fields, estate.dataForm)}
                </div>
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

export default AddEstateScreen;
