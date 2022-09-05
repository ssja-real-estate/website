import React, { FC, useState, useRef, useEffect } from "react";
import * as FiIcon from "react-icons/fi";
import * as RiIcon from "react-icons/ri";
import * as BSIcon from "react-icons/bs";

import Province, { defaultProvince } from "../../global/types/Province";

import { globalState } from "../../global/states/globalStates";
import LocationService from "../../services/api/LocationService/LocationService";
import { useRecoilValue } from "recoil";
import Strings from "../../data/strings";
import Select from "../formComponent/Select";
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
import { useRouter } from "next/router";
import { Field, FieldType } from "../../global/types/Field";
import SearchFilter from "../../global/types/Filter";
import Spiner from "../spinner/Spiner";
import ReactDOM from "react-dom";
import Modal from "../modal/Modal";
import ModalOption from "../../global/types/ModalOption";
import AdvanceFilterButton from "../sidebar/AdvanceFilterButton";

interface Props {
  setCore: (mapinfo: MapInfo) => void;
  onSetEstate: (estates: Estate[]) => void;
  width: string;
  closeModalHandler?: (close: boolean) => void;
}

const SidebarMap: FC<Props> = (props) => {
  const [showAdvanceFilter, setShowAdvanceFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingEstates, setLoadingEstates] = useState(false);
  const [noFilterExists, setNoFilterExists] = useState(false);
  const [isAdvancedFilter, toggleAdvancedFilter] = useState(true);
  const [searchedEstates, setSearchedEstates] = useState<Estate[]>([]);
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
  const searchService = useRef(new SearchService());
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
  const [dataForm, setDataForm] = useState<EstateForm>(defaultForm);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalOptiong, setModalOption] = useState<ModalOption>();
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
      .catch((e) => {
        console.log(e);

        // toast.error(Strings.loadingLocationsFailed);
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
        console.log(error);

        // toast.error(Strings.loadingOptionsFailed);
      });
  }

  function clearStates() {
    setSelectedDelegationType(defaultDelegationType);
    setSelectedEstateType(defaultEstateType);
    setDataForm(defaultForm);
    setEstate(defaultEstate);
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
    props.setCore(province.mapInfo);
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
    if (city.mapInfo) {
      props.setCore(city.mapInfo);
    }
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
    if (neighborhood.mapInfo) {
      props.setCore(neighborhood.mapInfo);
    }
  }

  function handleDelegationChange(data: string) {
    // console.log(event.currentTarget.value);

    setSelectedDelegationType({
      id: data,
      name: data,
    });
  }

  function handleTypeChange(data: string) {
    setSelectedEstateType({
      id: data,
      name: data,
    });
    console.log(selectedEstateType);

    setNoFilterExists((prev) => false);
  }
  async function searchEstate() {
    console.log(selectedDelegationType.id, selectedEstateType.id);

    console.log("dataForm:");
    console.log(dataForm);
    props.onSetEstate([]);
    const errors = validateForm(dataForm);
    if (errors.length > 0) {
      let messageError = "";
      // alert(String(errors[0].message));
      setIsShowModal(true);
      setModalOption({
        message: errors[0].message,
        closeModal: () => setIsShowModal(false),
        icon: (
          <div className="flex flex-col items-center justify-center text-dark-blue gap-2">
            <BSIcon.BsInfoCircleFill className="text-dark-blue text-[70px]" />
            <span className="text-sm">توجه</span>
          </div>
        ),
      });
      return;
      // for (let i = 0; i < errors.length; i++) {
      //   const error = errors[i];
      //   // console.log(error);
      //   alert(error.message);
      //   // messageError += error.message + ",";
      //   // toast.error(error.message, {
      //   //   duration: 3000,
      //   // });
      // }
      // // alert(messageError);
      // return;
    }
    setLoadingEstates((prev) => true);

    const filter = buildFilter();
    const fetchedEstates = await searchService.current.searchEstates(filter);
    console.log(fetchedEstates);

    setSearchedEstates(fetchedEstates);
    setLoadingEstates((prev) => false);
    props.onSetEstate(fetchedEstates);
    if (props.closeModalHandler !== undefined) {
      props.closeModalHandler(false);
    }
    if (fetchedEstates.length === 0) {
      setIsShowModal(true);
      setModalOption({
        message: "مکانی با مشخصات وارد شده یافت نشد",
        closeModal: () => setIsShowModal(false),
        icon: (
          <div className="flex flex-col items-center justify-center text-dark-blue gap-2">
            <BSIcon.BsInfoCircleFill className="text-dark-blue text-[70px]" />
            <span className="text-sm">توجه</span>
          </div>
        ),
      });
    }
  }
  function closeModal() {
    if (props.closeModalHandler !== undefined) {
      props.closeModalHandler(false);
    }
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

  function mapFields(fields: Field[], form: EstateForm) {
    console.log(fields);

    return fields.map((field, fieldIndex) => {
      return (
        <div key={fieldIndex} className="input-item py-3">
          {field.type !== FieldType.Image ? (
            <label className="dynamicLabel">{field.title + ":"}</label>
          ) : null}
          {field.type === FieldType.Text ? (
            <input
              type="text"
              value={field.value ? String(field.value) : ""}
              onChange={(e: { target: { value: any } }) => {
                const stringValue = String(e.target.value);
                onFieldChange(stringValue, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Range ? (
            <div className="flex flex-col gap-1 py-2 px-2 border border-gray-400">
              <div className="">
                <label className="text-gray-300">{Strings.minValue}</label>
                <input
                  type="number"
                  value={field.min ?? ""}
                  onChange={(e: {
                    currentTarget: { value: string | number };
                  }) => {
                    const value = +e.currentTarget.value;
                    onFieldChange(value, fieldIndex, true);
                  }}
                />
              </div>
              <div>
                <label className="text-gray-300">{Strings.maxValue}</label>
                <input
                  type="number"
                  value={field.max ?? ""}
                  onChange={(e: {
                    currentTarget: { value: string | number };
                  }) => {
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
            </select>
          ) : field.type === FieldType.Bool ? (
            <input
              className=""
              type="checkbox"
              checked={field.value ? true : false}
              onChange={(e: { target: { checked: any } }) => {
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
          ) : field.type === FieldType.SelectiveConditional ? (
            <>
              <select
                className="w-full"
                value={field.value ? String(field.value) : "default"}
                onChange={(e: { currentTarget: { value: any } }) => {
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
                      onChange={(e: { target: { checked: any } }) => {
                        const booleanValue = e.target.checked;
                        onFieldChange(booleanValue, fieldIndex, false, key);
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
  function onConditionalFieldChange(
    targetValue: any,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm,
    selectiveKey?: string,
    min: boolean = false
  ) {
    const field = form.fields[fieldIndex];
    if (!field) return;
    if (field.type === FieldType.SelectiveConditional) {
      onSelectiveConditionalFieldChange(
        targetValue,
        fieldIndex,
        innerFieldIndex,
        form,
        selectiveKey!,
        min
      );
      return;
    }
    let currentField = {
      ...form.fields[fieldIndex].fields![innerFieldIndex],
    };
    currentField = handleRangeFieldValue(currentField, targetValue, min);
    const fields = form.fields;
    const innerFields = fields[fieldIndex].fields!;
    innerFields[innerFieldIndex] = currentField;
    fields[fieldIndex] = { ...fields[fieldIndex], fields: innerFields };
  }
  function onSelectiveConditionalFieldChange(
    targetValue: any,
    fieldIndex: number,
    innerFieldIndex: number,
    form: EstateForm,
    selectiveKey: string,
    min: boolean = false
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
  function mapConditionalFields(
    fields: Field[],
    form: EstateForm,
    fieldIndex: number,
    selectiveKey?: string
  ) {
    return fields.map((innerField, innerFieldIndex) => {
      return (
        <div key={innerFieldIndex} className="input-item py-3">
          <label className="mb-2 dynamicLabel">{innerField.title}:</label>
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
            <div className="d-flex flex-row justify-content-evenly align-items-center ">
              <div>
                <label>{Strings.minValue}:</label>
                <input
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
                    onConditionalFieldChange(
                      value,
                      fieldIndex,
                      innerFieldIndex,
                      form,
                      selectiveKey,
                      true
                    );
                  }}
                />
              </div>
              <div>
                <label>{Strings.maxValue}</label>
                <input
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
                    onConditionalFieldChange(
                      value,
                      fieldIndex,
                      innerFieldIndex,
                      form,
                      selectiveKey
                    );
                  }}
                />
              </div>
            </div>
          ) : innerField.type === FieldType.Select ? (
            <select
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
  function handleRangeFieldValue(
    field: Field,
    targetValue: any,
    min: boolean = false
  ) {
    if (field.type === FieldType.Range) {
      const value = +targetValue;
      let range = [field.min ?? 0, field.max ?? 0];
      if (min) range[0] = value;
      else range[1] = value;
      if (min) field.min = range[0];
      else field.max = range[1];
    } else {
      field.value = targetValue;
    }
    return { ...field };
  }
  function onFieldChange(
    targetValue: any,
    fieldIndex: number,
    min: boolean = false,
    key?: string
  ) {
    let currentField = {
      ...dataForm.fields[fieldIndex],
    };

    if (currentField.type === FieldType.Range) {
      currentField = handleRangeFieldValue(currentField, targetValue, min);
    } else if (currentField.type === FieldType.MultiSelect) {
      const fieldValue = currentField.value as { [key: string]: boolean };
      if (key && fieldValue) {
        fieldValue[key] = targetValue;
        currentField.value = fieldValue;
      }
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

  async function handleAdvancedFilter() {
    if (isDefault) {
      // toast.error(Strings.chooseDelegationAndEstateTypes);

      setIsShowModal(true);

      setModalOption({
        message: Strings.chooseDelegationAndEstateTypes,
        closeModal: () => setIsShowModal(false),
        icon: (
          <div className="flex flex-col items-center justify-center text-dark-blue gap-2">
            <BSIcon.BsInfoCircleFill className="text-dark-blue text-[70px]" />
            <span className="text-sm">توجه</span>
          </div>
        ),
      });
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

  return (
    <div
      className={`h-full py-5 px-14 w-${props.width} bg-[rgba(44,62,80,.85)] overflow-y-auto flex flex-col justify-between`}
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
            onChange={handleNeighborhoodChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={delegationTypes}
            defaultValue=""
            value={selectedDelegationType.name}
            label={{
              htmlForLabler: "delegationTypes",
              titleLabel: "نوع درخواست",
              labelColor: "white",
            }}
            onChange={handleDelegationChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={estateTypes}
            defaultValue=""
            value={selectedEstateType.name}
            label={{
              htmlForLabler: "delegationTypes",
              titleLabel: "نوع ملک",
              labelColor: "white",
            }}
            onChange={handleTypeChange}
          />
        </div>

        {/* <button
          onClick={
            // () => setShowAdvanceFilter((prev) => !prev)
            handleAdvancedFilter
          }
          className="border border-white w-full h-10 px-3 flex flex-row items-center justify-center text-white gap-2 transition-all duration-200 hover:shadow-lg active:pt-2"
        >
          <FiIcon.FiFilter className="w-5 h-5" />
          <span>فیلتر پیشرفته</span>
        </button> */}
        <AdvanceFilterButton
          isDefault={isDefault}
          advancedSearchHandler={handleAdvancedFilter}
          clearAdvancedFilter={clearStates}
          // loadLoaction={loadLocations}
          // loadOption={loadOptions}
          setNoFilterExists={() => setNoFilterExists(false)}
        />

        {/* {showAdvanceFilter && (
          <div className="w-full h-[500px] z-20 overflow-y-auto overflow-x-hidden text-white px-4">
            {mapFields(dataForm.fields, dataForm)}
          </div>
        )} */}
        {loading ? (
          <div>
            <Spiner />
          </div>
        ) : (
          <div className="w-52 ">
            {dataForm.fields.length > 0 && (
              <div className="section card glass shadow-sm py-2  my-2">
                {mapFields(dataForm.fields, dataForm)}
              </div>
            )}
            {noFilterExists ? (
              <div className="flex items-center justify-center">
                <h4 className="">{Strings.noFilterForThisForm}</h4>
              </div>
            ) : null}
          </div>
        )}
        <button
          onClick={searchEstate}
          className="bg-[#f3bc65] h-10 px-3  border-b-4 border-b-[#d99221] hover:border-b-[#f3bc65] w-full font-bold text-[#222222]  active:border-b-0 active:border-t-4 active:border-t-[#d99221] mt-3"
        >
          جستجو
        </button>
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
      {isShowModal && <Modal options={modalOptiong}></Modal>}
    </div>
  );
};

export default SidebarMap;
