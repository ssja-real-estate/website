import { useState, useRef, useEffect, FC, ChangeEvent } from "react";
import * as RiIcon from "react-icons/ri";
import * as BSIcon from "react-icons/bs";
import Province, { defaultProvince } from "../../global/types/Province";
import { globalState } from "../../global/states/globalStates";
import LocationService from "../../services/api/LocationService/LocationService";
import { useRecoilValue } from "recoil";
import Strings from "../../data/strings";
import Select from "../../components/formcomponent/Select";
import City, { defaultCity } from "../../global/types/City";
import Neighborhood, {
  defaultNeighborhood,
} from "../../global/types/Neighborhood";
import MapInfo from "../../global/types/MapInfo";
import { defaultEstate, Estate } from "../../global/types/Estate";
import EstateType, { defaultEstateType } from "../../global/types/EstateType";
import DelegationType, {
  defaultDelegationType,
} from "../../global/types/DelegationType";
import FormService from "../../services/api/FormService/FormService";
import DelegationTypeService from "../../services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "../../services/api/EstateTypeService/EstateTypeService";
import EstateService from "../../services/api/EstateService/EstateService";
import SearchService from "../../services/api/SearchService/SearchService";
import { validateForm } from "../../services/utilities/fieldValidations";
import { defaultForm, EstateForm } from "../../global/types/EstateForm";
import { Field, FieldType } from "../../global/types/Field";
import Spiner from "../spinner/Spiner";
import Modal from "../modal/Modal";
import ModalOption from "../../global/types/ModalOption";
import { estateScreenAtom, ScreenType } from "../../global/states/EstateScreen";
import GlobalState, { imagesBaseUrl } from "../../global/states/GlobalState";
import Image from "next/image";

interface Props {
  setCore: (mapinfo: MapInfo) => void;
  onSetEstate: (estates: Estate[]) => void;
  width?: string;
  closeModalHandler?: (close: boolean) => void;
}

const EditEstateSideBar: FC<Props> = (props) => {
  const { inputEstate, screenType } = useRecoilValue(estateScreenAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [estate, setEstate] = useState<Estate>(defaultEstate);
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

  const searchService = useRef(new SearchService());
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [imagesCount, setImagesCount] = useState<number>(0);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const state = useRecoilValue<GlobalState>(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const [mapInfo, setMapInfo] = useState<MapInfo>();
  const [previousImages, setPreviousImages] = useState<string[]>([]);
  const [dataForm, setDataForm] = useState<EstateForm>(defaultForm);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalOption, setModalOption] = useState<ModalOption>();
  useEffect(() => {
    setServinceTokens();

    loadLocations();

    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDelegationType, selectedEstateType, state.token]);

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
        setProvinces(fetchedProvinces.sort((a,b)=> a.name.localeCompare(b.name)));
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
        // toast.error(Strings.loadingLocationsFailed);
        setIsShowModal(true);
        setModalOption({
          message: Strings.loadingLocationsFailed,
          closeModal: () => setIsShowModal(false),
        });
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
    setSelectedProvince({
      ...province,
      name: province.id,
    });

    setCities((prev) => province.cities.sort((a,b) => a.name.localeCompare(b.name)));
    if (!cityId) return;
    const city = province.cities.find((c) => c.id === cityId);
    if (!city) return;
    setSelectedCity({
      ...city,
      name: city.id,
    });

    setNeighborhoods((prev) => city.neighborhoods);
    if (!neighborhoodId) return;
    const neighborhood = city.neighborhoods.find(
      (n) => n.id === neighborhoodId
    );
    if (!neighborhood) return;
    setSelectedNeighborhood({
      ...neighborhood,
      name: neighborhood.id,
    });
    neighborhood.mapInfo && props.setCore(neighborhood.mapInfo);
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
        setIsShowModal(true);
        setModalOption({
          message: error.loadingOptionsFailed,
          closeModal: () => setIsShowModal(false),
        });
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
    if (!form.fields || form.fields.length < 1) return;

    const firstField = form.fields[0];

    if (firstField.type !== FieldType.Image) return;
    console.log(firstField);
    setPreviousImages((firstField.value as string[]) ?? []);
  }

  function handleProvinceChange(provinceId: string) {
    const province = provinces.find((p) => p.id === provinceId);

    if (!province) {
      return;
    }

    setSelectedProvince({
      id: provinceId,
      name: provinceId,
      cities: province.cities.sort((a,b)=>a.name.localeCompare(b.name)),
      mapInfo: province.mapInfo,
    });
    setSelectedCity(defaultCity);
    setSelectedNeighborhood(defaultNeighborhood);
    setMapInfo(province.mapInfo);
    setCities(province.cities.sort((a,b)=>a.name.localeCompare(b.name)));
    if (province.mapInfo) {
      props.setCore(province.mapInfo);
    }
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

    if (!city) {
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
    if (city.mapInfo) {
      props.setCore(city.mapInfo);
    }
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

    if (!neighborhood) {
      return;
    }

    setSelectedNeighborhood({
      id: neighborhoodId,
      name: neighborhoodId,
      mapInfo: neighborhood.mapInfo,
    });
    setMapInfo(neighborhood.mapInfo);
    if (neighborhood.mapInfo) {
      neighborhood.mapInfo && props.setCore(neighborhood.mapInfo);
    }
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
  function onFieldChange(targetValue: any, fieldIndex: number, key?: string) {
    const currentField = {
      ...estate.dataForm.fields[fieldIndex],
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

    let fields = estate.dataForm.fields;
    fields[fieldIndex] = { ...currentField };

    setEstate({
      ...estate,
      dataForm: {
        ...estate.dataForm,
        fields,
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
    };
    // currentField = handleRangeFieldValue(currentField, targetValue, min);
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
        <div key={fieldIndex} className="py-3">
          <label className="dynamicLabel">
            {field.title} {field.optional ? Strings.optionalField : ""}
          </label>

          {field.type === FieldType.Text ? (
            <input
              type="text"
              className="w-full"
              value={field.value ? String(field.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);

                onFieldChange(stringValue, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Number ? (
            <input
              type="number"
              className="w-full"
              value={field.value ? Number(field.value) : ""}
              onChange={(e) => {
                const numberValue = Number(e.target.value);

                onFieldChange(numberValue, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Image ? (
            <div className="h-[150px] w-full">
              {previousImages.length > 0
                ? previousImages.map((img, idx) => (
                    <div key={idx}>
                      <Image
                        width={200}
                        height={150}
                        layout="responsive"
                        src={`${imagesBaseUrl}/${estate.id}/${img}`}
                        alt={`${imagesBaseUrl}/${estate.id}/${img}`}
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
                  ))
                : null}
              <input
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
            </div>
          ) : field.type === FieldType.Range ? (
            <div className="flex flex-col gap-1 py-2 px-2 border border-gray-400">
              <div className="">
                <label className="text-gray-300">{Strings.minValue}</label>
                <input
                  className="w-full"
                  type="number"
                  value={field.min ?? ""}
                  onChange={(e) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex);
                  }}
                />
              </div>
              <div>
                <label className="text-gray-300">{Strings.maxValue}</label>
                <input
                  className="w-full"
                  type="number"
                  value={field.max ?? ""}
                  onChange={(e) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex);
                  }}
                />
              </div>
            </div>
          ) : field.type === FieldType.Select ? (
            <select
              className="w-full"
              value={field.value ? String(field.value) : "default"}
              onChange={(e) => {
                const numberValue = String(e.target.value);
                // debugger;
                onFieldChange(numberValue, fieldIndex);
              }}
            >
              <option value="default" disabled>
                {Strings.choose}
              </option>
              {field.options?.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
            </select>
          ) : field.type === FieldType.Bool ? (
            <input
              className=""
              type="checkbox"
              checked={field.value ? true : false}
              onChange={(e) => {
                const booleanValue = e.target.checked;
                onFieldChange(booleanValue, fieldIndex);
              }}
            />
          ) : field.type === FieldType.BooleanConditional ? (
            <>
              <input
                className=""
                type="checkbox"
                checked={field.value ? true : false}
                onChange={(e) => {
                  const booleanValue = e.target.checked;
                  onFieldChange(booleanValue, fieldIndex);
                }}
              />
              {field.value &&
                mapConditionalFields(field.fields!, form, fieldIndex)}
            </>
          ) : field.type === FieldType.SelectiveConditional ? (
            <>
              <select
                className="w-full"
                value={field.value ? String(field.value) : "default"}
                onChange={(e) => {
                  const selectValue = String(e.currentTarget.value);
                  onFieldChange(selectValue, fieldIndex);
                }}
              >
                <option value="default" disabled>
                  {Strings.choose}
                </option>
                {field.options?.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
              </select>
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
            <div className="flex flex-row flex-wrap gap-2 text-sm pr-2">
              {field.keys!.map((key, index) => {
                const keyMap = field.value as { [key: string]: boolean };
                return (
                  <div
                    className="border rounded-full flex items-center justify-center p-2"
                    key={index}
                  >
                    <label className="text-gray-300">{key}</label>
                    <input
                      className="mx-1"
                      type="checkbox"
                      checked={keyMap[key]}
                      onChange={(e) => {
                        const booleanValue = e.target.checked;
                        onFieldChange(booleanValue, fieldIndex, key);
                      }}
                    />
                  </div>
                );
              })}
            </div>
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
            {innerField.title}{" "}
            {innerField.optional ? Strings.optionalField : null}
          </label>
          {innerField.type === FieldType.Text ? (
            <input
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
            <input
              type="number"
              value={innerField.value ? Number(innerField.value) : ""}
              onChange={(e) => {
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
            <select
              value={innerField.value ? String(innerField.value) : "default"}
              onChange={(e) => {
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
            </select>
          ) : innerField.type === FieldType.Bool ? (
            <input
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
          ) : null}
        </div>
      );
    });
  }


  async function submitEstate() {
    if (!selectedProvince.id || !selectedCity.id || !selectedNeighborhood.id) {
      setIsShowModal(true);
      setModalOption({
        message: Strings.enterlocationInfo,
        closeModal: () => setIsShowModal(false),
      });
      return;
    }
    console.log(previousImages.length);

    if (imagesCount + previousImages.length > 10) {
      setIsShowModal(true);
      setModalOption({
        message: Strings.enterlocationInfo,
        closeModal: () => setIsShowModal(false),
      });
      return;
    }

    const errors = validateForm(estate.dataForm);

    if (errors.length > 0) {
      setIsShowModal(true);
      setModalOption({
        message: errors[0].message,
        closeModal: () => setIsShowModal(false),
      });
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
      // setSelectedProvince(defaultProvince);
      // setSelectedCity(defaultCity);
      // setSelectedNeighborhood(defaultNeighborhood);
      // setSelectedDelegationType(defaultDelegationType);
      // setSelectedEstateType(defaultEstateType);
      // setFormData(new FormData());
      // setEstate(defaultEstate);
    }

    setLoading((prev) => false);
    // setIsShowModal(true);
    // setModalOption({
    //   message: Strings.addEstateRequestSuccess,
    //   closeModal: () => setIsShowModal(false),
    // });
    history.back();
  }

  // function handleDelegationChange(data: string) {
  //   setSelectedDelegationType({
  //     id: data,
  //     name: data,
  //   });
  // }

  // function handleTypeChange(data: string) {
  //   setSelectedEstateType({
  //     id: data,
  //     name: data,
  //   });
  // }

  function closeModal() {
    if (props.closeModalHandler !== undefined) {
      props.closeModalHandler(false);
    }
  }

  return (
    <div
      className={`MyScroll h-full py-5 px-14 w-96 bg-[rgba(44,62,80,.85)] overflow-y-auto flex flex-col justify-between`}
    >
      <div className={`space-y-4 }`}>
        <div className="flex flex-col gap-1">
          <Select
            options={provinces}
            defaultValue=""
            label={{
              htmlForLabler: "provinces",
              titleLabel: "استان",
              labelColor: "white",
            }}
            value={selectedProvince?.name}
            onChange={handleProvinceChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={cities}
            defaultValue=""
            label={{
              htmlForLabler: "cities",
              titleLabel: "شهرستان",
              labelColor: "white",
            }}
            value={selectedCity.name}
            onChange={handleCityChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={neighborhoods}
            defaultValue=""
            label={{
              htmlForLabler: "neighborhoods",
              titleLabel: "منطقه",
              labelColor: "white",
            }}
            value={selectedNeighborhood.name}
            onChange={handleNeighborhoodChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={delegationTypes}
            // defaultValue=""
            value={selectedDelegationType.id}
            label={{
              htmlForLabler: "delegationTypes",
              titleLabel: "نوع درخواست",
              labelColor: "white",
            }}
            isDisabled={true}
            onChange={null}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={estateTypes}
            // defaultValue=""
            value={selectedEstateType.id}
            label={{
              htmlForLabler: "delegationTypes",
              titleLabel: "نوع ملک",
              labelColor: "white",
            }}
            isDisabled={true}
            onChange={null}
          />
        </div>
        {isDefault ? (
          // <h4 className="text-white gap-2 bg-dark-blue/75 rounded-2xl px-2 py-2 flex flex-col items-center text-sm justify-between">
          //   <BSIcon.BsFillExclamationTriangleFill className="text-2xl" />
          //   {Strings.chooseDelegationAndEstateTypes}
          // </h4>
          <div>
            <Spiner />
          </div>
        ) : loading ? (
          <div>
            <Spiner />
          </div>
        ) : (
          <>
            <div className="w-full">
              {mapFields(estate.dataForm.fields, estate.dataForm)}
            </div>
            {!estate.dataForm.id ? (
              <h4 className="text-white border rounded-2xl px-2 py-2 flex flex-row items-center text-sm justify-between">
                {Strings.formDoesNotExist}
                <BSIcon.BsFillExclamationTriangleFill />
              </h4>
            ) : (
              <button
                className="bg-[#f3bc65] h-10 px-3  border-b-4 border-b-[#d99221] hover:border-b-[#f3bc65] w-full font-bold text-[#222222]  active:border-b-0 active:border-t-4 active:border-t-[#d99221] mt-3"
                onClick={submitEstate}
              >
                {Strings.addEstate}
              </button>
            )}
          </>
        )}
      </div>
      <div className="block md:hidden">
        <button
          onClick={closeModal}
          className="border border-white w-full h-10 px-3 flex flex-row items-center justify-center text-white gap-2 transition-all duration-200 hover:shadow-lg active:pt-2"
        >
          <RiIcon.RiCloseCircleFill className="w-5 h-5" />
          <span>بستن</span>
        </button>
      </div>
      {isShowModal && <Modal options={modalOption}></Modal>}
    </div>
  );
};

export default EditEstateSideBar;
