// components/AddEstate/AddEstateSideBar.tsx
import { useState, useRef, useEffect, FC, ChangeEvent } from "react";
import * as RiIcon from "react-icons/ri";
import * as BSIcon from "react-icons/bs";

import Province, { defaultProvince } from "../../global/types/Province";

import { globalState } from "../../global/states/globalStates";
import LocationService from "../../services/api/LocationService/LocationService";
import { useRecoilValue } from "recoil";
import Strings from "../../data/strings";
import Select from "../formcomponent/Select";
import City, { defaultCity } from "../../global/types/City";
// حذف import Neighborhood (لیست کشویی منطقه دیگر نداریم)
// import Neighborhood, { defaultNeighborhood } from "../../global/types/Neighborhood";

import MapInfo from "../../global/types/MapInfo";
import { defaultEstate, Estate } from "../../global/types/Estate";
import EstateType, { defaultEstateType } from "../../global/types/EstateType";
import DelegationType, { defaultDelegationType } from "../../global/types/DelegationType";
import FormService from "../../services/api/FormService/FormService";
import DelegationTypeService from "../../services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "../../services/api/EstateTypeService/EstateTypeService";
import EstateService from "../../services/api/EstateService/EstateService";
import SearchService from "../../services/api/SearchService/SearchService";
import { validateForm } from "../../services/utilities/fieldValidations";
import { defaultForm, EstateForm } from "../../global/types/EstateForm";
import { Field, FieldType } from "../../global/types/Field";
import SearchFilter from "../../global/types/Filter";
import Spiner from "../spinner/Spiner";
import Modal from "../modal/Modal";
import ModalOption from "../../global/types/ModalOption";

import { mapClickState } from "../../global/states/mapClickStates";

interface Props {
  setCore: (mapinfo: MapInfo) => void;
  onSetEstate: (estates: Estate[]) => void;
  width?: string;
  closeModalHandler?: (close: boolean) => void;
}

const AddEstateSidebar: FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [estate, setEstate] = useState<Estate>(defaultEstate);
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  // const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]); // حذف شد

  const [selectedProvince, setSelectedProvince] = useState<Province>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);
  // const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>(defaultNeighborhood); // حذف

  const [selectedDelegationType, setSelectedDelegationType] = useState<DelegationType>(defaultDelegationType);
  const [selectedEstateType, setSelectedEstateType] = useState<EstateType>(defaultEstateType);

  const isDefault: boolean = !selectedDelegationType.name || !selectedEstateType.name ? true : false;

  const searchService = useRef(new SearchService());
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [imagesCount, setImagesCount] = useState<number>(0);

  const state = useRecoilValue(globalState);
  const mapClick = useRecoilValue(mapClickState);

  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const estateService = useRef(new EstateService());
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const [mapInfo, setMapInfo] = useState<MapInfo>();
  const [value, setValue] = useState<string>("");
  const [mortgage, setMortgage] = useState<string>("");
  const [dataForm, setDataForm] = useState<EstateForm>(defaultForm);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalOption, setModalOption] = useState<ModalOption>();

  // NEW: آدرس کامل از reverse
  const [addressText, setAddressText] = useState<string>("");

  // env key
  const MAPIR_API_KEY =
    (process.env.NEXT_PUBLIC_MAPIR_KEY ||
      (import.meta as any)?.env?.VITE_MAPIR_KEY ||
      "") as string;

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

  const addCommas = (num: string): string => {
    const n = parseInt(num);
    return Number.isNaN(n) ? "" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, "");
  const handleChange = (e: string) => setValue(addCommas(removeNonNumeric(e)));
  const handleChangeMortgage = (e: string) => setMortgage(addCommas(removeNonNumeric(e)));

  const loadLocations = async () => {
    locationService.current
      .getAllProvinces()
      .then((fetchedProvinces) => {
        setProvinces(fetchedProvinces.sort((a, b) => a.name.localeCompare(b.name)));
        if (selectedProvince?.id) {
          const province = fetchedProvinces.find((p) => p.id === selectedProvince.id);
          if (province) {
            setSelectedProvince({ ...province });
            setCities(() => province.cities.sort((a, b) => a.name.localeCompare(b.name)));
            if (selectedCity?.id) {
              const city = province.cities.find((c) => c.id === selectedCity.id);
              if (city) {
                setSelectedCity({ ...city });
                // setNeighborhoods(city.neighborhoods); // حذف
              }
            }
          }
        }
      })
      .catch(() => {
        setIsShowModal(true);
        setModalOption({
          message: Strings.loadingLocationsFailed,
          closeModal: () => setIsShowModal(false),
        });
      });
  };

  async function loadOptions() {
    delegationTypeService.current
      .getAllDelegationTypes()
      .then((delegationTypes) => setDelegationTypes(delegationTypes))
      .then(() => estateTypeService.current.getAllEstateTypes())
      .then((estateTypes) => setEstateTypes(estateTypes))
      .catch(() => {
        setIsShowModal(true);
        setModalOption({
          message: Strings.loadingOptionsFailed,
          closeModal: () => setIsShowModal(false),
        });
      });
  }

  async function loadData() {
    if (!loading) setLoading(true);
    if (!selectedDelegationType.id || !selectedEstateType.id) {
      setLoading(false);
      return;
    }
    const loadedForm = await formService.current.getForm(selectedDelegationType.id, selectedEstateType.id);
    setEstate({ ...estate, dataForm: loadedForm });
    await loadLocations();
    await loadOptions();
    setLoading(false);
  }

  async function submitEstate() {
    // حالا به جای «Select منطقه»، آدرس و مختصات الزامی‌اند
    const hasCoords = !!(estate.mapInfo?.latitude && estate.mapInfo?.longitude);
    if (!selectedProvince.id || !selectedCity.id || !hasCoords) {
      setIsShowModal(true);
      setModalOption({
        message: Strings.enterlocationInfo,
        closeModal: () => setIsShowModal(false),
      });
      return;
    }
    if (imagesCount > 10) {
      setIsShowModal(true);
      setModalOption({
        message: Strings.imagesSizeLimit,
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

    setLoading(true);
    const fd = new FormData();
    for (const [k, v] of (formData as any).entries?.() || []) fd.append(k, v as any);
    fd.append("estate", JSON.stringify(estate));

    const response = await estateService.current.requestAddEtate(fd);

    if (response) {
      setSelectedProvince(defaultProvince);
      setSelectedCity(defaultCity);
      // setSelectedNeighborhood(defaultNeighborhood); // حذف
      setSelectedDelegationType(defaultDelegationType);
      setSelectedEstateType(defaultEstateType);
      setFormData(new FormData());
      setEstate(defaultEstate);
      setAddressText("");
    }

    setLoading(false);
    setIsShowModal(true);
    setModalOption({
      message: Strings.addEstateRequestSuccess,
      closeModal: () => setIsShowModal(false),
    });
  }

  function handleProvinceChange(provinceId: string) {
    const province = provinces.find((p) => p.id === provinceId);
    if (!province) return;

    setSelectedProvince({ id: provinceId, name: provinceId, cities: province.cities, mapInfo: province.mapInfo });
    setSelectedCity(defaultCity);
    setMapInfo(province.mapInfo);
    setCities(province.cities.sort((a, b) => a.name.localeCompare(b.name)));

    setEstate((prev) => ({
      ...prev,
      province: { id: provinceId, name: province.name },
    }));

    if (province.mapInfo) props.setCore(province.mapInfo);
  }

  function handleCityChange(cityId: string) {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return;

    setSelectedCity({ id: cityId, name: cityId, neighborhoods: city.neighborhoods, mapInfo: city.mapInfo });
    if (city.mapInfo) props.setCore(city.mapInfo);

    setEstate((prev) => ({
      ...prev,
      city: { id: cityId, name: city.name },
    }));
  }

  function handleDelegationChange(data: string) {
    setSelectedDelegationType({ id: data, name: data });
  }

  function handleTypeChange(data: string) {
    setSelectedEstateType({ id: data, name: data,order:1});
  }

  function closeModal() {
    if (props.closeModalHandler) props.closeModalHandler(false);
  }

  function buildFilter() {
    const filter: SearchFilter = {
      header: {
        assignmentTypeId: selectedDelegationType.id,
        estateTypeId: selectedEstateType.id,
        provinceId: selectedProvince.id,
        cityId: selectedCity.id,
        // neighbordhoodId حذف می‌شود یا  بر حسب نیاز صفر/خالی شود
      },
      form: dataForm.id ? dataForm : undefined,
    };
    return filter;
  }

  function checkFileSizes(files: File[]): boolean {
    const sumOfFileSizes = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    return sumOfFileSizes > 2048;
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
                onFieldChange(stringValue, form, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Number ? (
            <input
              type="number"
              className="w-full"
              value={field.value ? Number(field.value) : ""}
              onChange={(e) => {
                const numberValue = String(e.target.value);
                onFieldChange(numberValue, form, fieldIndex);
              }}
            />
          ) : field.type === FieldType.Image ? (
            <input
              type="file"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let selectedFiles = Array.from(e.target.files || []);
                setImagesCount(selectedFiles.length);

                if (!checkFileSizes(selectedFiles)) {
                  alert(Strings.imagesSizeLimit);
                  e.target.value = "";
                  selectedFiles = [];
                }

                const data = new FormData();
                selectedFiles.forEach((file) => data.append("images", file));
                setFormData(data);
              }}
            />
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
                    onFieldChange(value, form, fieldIndex);
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
                    onFieldChange(value, form, fieldIndex);
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
                onFieldChange(numberValue, form, fieldIndex);
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
              checked={!!field.value}
              onChange={(e) => {
                const booleanValue = e.target.checked;
                onFieldChange(booleanValue, form, fieldIndex);
              }}
            />
          ) : field.type === FieldType.BooleanConditional ? (
            <>
              <input
                className=""
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => {
                  const booleanValue = e.target.checked;
                  onFieldChange(booleanValue, form, fieldIndex);
                }}
              />
              {field.value && !!field.fields && mapConditionalFields(field.fields!, form, fieldIndex)}
            </>
          ) : field.type === FieldType.SelectiveConditional ? (
            <>
              <select
                className="w-full"
                value={field.value ? String(field.value) : "default"}
                onChange={(e) => {
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
              </select>
              {field.value &&
                mapConditionalFields(
                  field.fieldMaps?.find((f) => f.key === field.value)?.fields ?? [],
                  form,
                  fieldIndex,
                  field.value as string
                )}
            </>
          ) : field.type === FieldType.MultiSelect ? (
            <div className="flex flex-row flex-wrap gap-2 text-sm pr-2">
              {field.keys!.map((key, index) => {
                return (
                  <div className="border rounded-full flex items-center justify-center p-2" key={index}>
                    <label className="text-gray-300">{key}</label>
                    <input
                      className="mx-1"
                      type="checkbox"
                      checked={(field.value as { [key: string]: boolean })?.[key]}
                      onChange={(e) => {
                        const booleanValue = e.target.checked;
                        onFieldChange(booleanValue, form, fieldIndex, key);
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
      onSelectiveConditionalFieldChange(targetValue, fieldIndex, innerFieldIndex, form, selectiveKey!);
      return;
    }
    let currentField = { ...form.fields[fieldIndex].fields![innerFieldIndex] };
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
    selectiveKey: string
  ) {
    const fieldMaps = form.fields[fieldIndex].fieldMaps ?? [];
    const selectiveFieldMapIndex = fieldMaps.findIndex((f) => f.key === selectiveKey);
    const selectiveFields = fieldMaps.find((f) => f.key === selectiveKey)?.fields ?? [];
    if (selectiveFields.length < innerFieldIndex + 1) return;

    const currentField = { ...selectiveFields[innerFieldIndex], value: targetValue };
    selectiveFields[innerFieldIndex] = currentField;
    if (selectiveFieldMapIndex !== -1) {
      fieldMaps[selectiveFieldMapIndex].fields = selectiveFields;
    }
    const fields = form.fields;
    fields[fieldIndex] = { ...fields[fieldIndex], fieldMaps };

    setEstate({
      ...estate,
      dataForm: { ...form, fields },
    });
  }

  function mapConditionalFields(fields: Field[], form: EstateForm, fieldIndex: number, selectiveKey?: string) {
    return fields.map((innerField, innerFieldIndex) => {
      return (
        <div key={innerFieldIndex} className="input-item py-3">
          <label className="mb-2 dynamicLabel">{innerField.title}:</label>
          {innerField.type === FieldType.Text ? (
            <input
              type="text"
              value={innerField.value ? String(innerField.value) : ""}
              onChange={(e) => {
                const stringValue = String(e.target.value);
                onConditionalFieldChange(stringValue, fieldIndex, innerFieldIndex, form, selectiveKey);
              }}
            />
          ) : innerField.type === FieldType.Number ? (
            <div className="d-flex flex-row justify-content-evenly align-items-center ">
              <div>
                <label>{Strings.minValue}:</label>
                <input
                  type="number"
                  value={(innerField.value as [number, number]) ? +(innerField.value as [number, number])[0] : ""}
                  onChange={(e) => {
                    const value = +e.currentTarget.value;
                    onConditionalFieldChange(value, fieldIndex, innerFieldIndex, form, selectiveKey, true);
                  }}
                />
              </div>
              <div>
                <label>{Strings.maxValue}</label>
                <input
                  type="number"
                  value={(innerField.value as [number, number]) ? +(innerField.value as [number, number])[1] : ""}
                  onChange={(e) => {
                    const value = +e.currentTarget.value;
                    onConditionalFieldChange(value, fieldIndex, innerFieldIndex, form, selectiveKey);
                  }}
                />
              </div>
            </div>
          ) : innerField.type === FieldType.Select ? (
            <select
              value={innerField.value ? String(innerField.value) : "default"}
              onChange={(e) => {
                const numberValue = String(e.currentTarget.value);
                onConditionalFieldChange(numberValue, fieldIndex, innerFieldIndex, form, selectiveKey);
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
              checked={!!innerField.value}
              onChange={(e) => {
                const booleanValue = e.target.checked;
                onConditionalFieldChange(booleanValue, fieldIndex, innerFieldIndex, form, selectiveKey);
              }}
            />
          ) : null}
        </div>
      );
    });
  }

  function handleRangeFieldValue(field: Field, targetValue: any, min: boolean = false) {
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

  function onFieldChange(targetValue: any, form: EstateForm, fieldIndex: number, key?: string) {
    const currentField = { ...form.fields[fieldIndex] };

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
      dataForm: { ...form, fields },
    });
  }

  // ---- گوش دادن به کلیک/درگ نقشه و reverse ----
  async function reverseMapIr(lat: number, lon: number) {
    const res = await fetch(`https://map.ir/reverse?lat=${lat}&lon=${lon}`, {
      headers: { "x-api-key": MAPIR_API_KEY, "Mapir-SDK": "reactjs" },
    });
    if (!res.ok) throw new Error("reverse failed");
    return res.json();
  }

  useEffect(() => {
    (async () => {
      if (!mapClick?.lat || !mapClick?.lng) return;
      try {
        const r = await reverseMapIr(mapClick.lat, mapClick.lng);

        console.log(r);
       const neighborhoodName: string = r?.neighborhood || r?.region || "";
        const fullAddress: string = r?.primary + " "+ r?.last + r?.poi ;
         console.log((r.region));
        setAddressText(fullAddress || "");

     
        // اگر همچنان ستون/فیلد "neighborhood" در مدل‌تان دارید و می‌خواهید نگه دارید:
        setEstate((prev) => ({
          ...prev,
          neighborhood: {
            id: prev.neighborhood?.id || "",
            name:  prev.neighborhood?.name || "",
          },
        }));

        // ذخیره آدرس و مختصات برای ارسال به سرور
        setEstate((prev) => ({
          ...prev,
          address: neighborhoodName || prev.address,
          mapInfo: {
            longitude: mapClick.lng,
            latitude: mapClick.lat,
            zoom: 15,
          },
        }));
      } catch {
        // silent
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapClick?.lat, mapClick?.lng]);

  return (
    <div className={`MyScroll h-full py-5 px-14 w-96 bg-[rgba(44,62,80,.85)] overflow-y-auto flex flex-col justify-between`}>
      <div className={`space-y-4 }`}>
        {/* استان */}
        <div className="flex flex-col gap-1">
          <Select
            options={provinces}
            defaultValue=""
            label={{ htmlForLabler: "provinces", titleLabel: "استان", labelColor: "white" }}
            value={selectedProvince.id}
            onChange={handleProvinceChange}
          />
        </div>

        {/* شهر */}
        <div className="flex flex-col gap-1">
          <Select
            options={cities}
            defaultValue=""
            label={{ htmlForLabler: "cities", titleLabel: "شهرستان", labelColor: "white" }}
            value={selectedCity.id}
            onChange={handleCityChange}
          />
        </div>

        {/* ✅ جایگزین Select منطقه: آدرس کامل + مختصات */}
        <div className="flex flex-col  h-28  gap-1">
          <label className="dynamicLabel text-white">آدرس کامل (از نقشه)</label>
          <textarea
            
            className="w-full"
                     
            value={addressText}
            onChange={(e) => {
              const v = e.target.value;
              setAddressText(v);
              setEstate((prev) => ({ ...prev, address: v }));
            }}
            placeholder="با کلیک/درگ روی نقشه خودکار پر می‌شود (قابل ویرایش)"
          />
        </div>
        {/* <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="dynamicLabel text-white">طول جغرافیایی</label>
            <input
              type="text"
              className="w-full"
              value={(estate.mapInfo?.longitude ?? mapInfo?.longitude ?? "").toString()}
              onChange={(e) => {
                const lng = Number(e.target.value);
                setEstate((prev) => ({
                  ...prev,
                  mapInfo: {
                    longitude: isNaN(lng) ? prev.mapInfo?.longitude ?? 0 : lng,
                    latitude: prev.mapInfo?.latitude ?? 0,
                    zoom: prev.mapInfo?.zoom ?? 15,
                  },
                }));
              }}
              placeholder="با کلیک روی نقشه پر می‌شود"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="dynamicLabel text-white">عرض جغرافیایی</label>
            <input
              type="text"
              className="w-full"
              value={(estate.mapInfo?.latitude ?? mapInfo?.latitude ?? "").toString()}
              onChange={(e) => {
                const lat = Number(e.target.value);
                setEstate((prev) => ({
                  ...prev,
                  mapInfo: {
                    longitude: prev.mapInfo?.longitude ?? 0,
                    latitude: isNaN(lat) ? prev.mapInfo?.latitude ?? 0 : lat,
                    zoom: prev.mapInfo?.zoom ?? 15,
                  },
                }));
              }}
              placeholder="با کلیک روی نقشه پر می‌شود"
            />
          </div>
        </div> */}
        {/* --- پایان جایگزین --- */}

        {/* نوع درخواست */}
        <div className="flex flex-col gap-1">
          <Select
            options={delegationTypes}
            value={selectedDelegationType.id}
            label={{ htmlForLabler: "delegationTypes", titleLabel: "نوع درخواست", labelColor: "white" }}
            onChange={handleDelegationChange}
          />
        </div>

        {/* نوع ملک */}
        <div className="flex flex-col gap-1">
          <Select
            options={estateTypes}
            value={selectedEstateType.name}
            label={{ htmlForLabler: "delegationTypes", titleLabel: "نوع ملک", labelColor: "white" }}
            onChange={handleTypeChange}
          />
        </div>

        {isDefault ? (
          <h4 className="text-white gap-2 bg-dark-blue/75 rounded-2xl px-2 py-2 flex flex-col items-center text-sm justify-between">
            <BSIcon.BsFillExclamationTriangleFill className="text-2xl" />
            {Strings.chooseDelegationAndEstateTypes}
          </h4>
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

export default AddEstateSidebar;
