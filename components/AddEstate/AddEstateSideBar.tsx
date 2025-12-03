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
// منطقه را حذف کردیم
// import Neighborhood, { defaultNeighborhood } from "../../global/types/Neighborhood";

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
import SearchFilter from "../../global/types/Filter";
import Spiner from "../spinner/Spiner";
import Modal from "../modal/Modal";
import ModalOption from "../../global/types/ModalOption";

import { mapClickState } from "../../global/states/mapClickStates";
import GlobalState from "../../global/states/GlobalState";

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

  const [selectedProvince, setSelectedProvince] =
    useState<Province>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);

  const [selectedDelegationType, setSelectedDelegationType] =
    useState<DelegationType>(defaultDelegationType);
  const [selectedEstateType, setSelectedEstateType] =
    useState<EstateType>(defaultEstateType);

  const isDefault: boolean =
    !selectedDelegationType.name || !selectedEstateType.name ? true : false;

  const searchService = useRef(new SearchService());
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [imagesCount, setImagesCount] = useState<number>(0);

  const state = useRecoilValue<GlobalState>(globalState);
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

  // آدرس کامل از reverse
  const [addressText, setAddressText] = useState<string>("");

  // برای اسکرول خودکار به فرم در موبایل
  const formRef = useRef<HTMLDivElement | null>(null);

  // env key – اگر جایی لازم شد
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
    return Number.isNaN(n)
      ? ""
      : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, "");
  const handleChange = (e: string) => setValue(addCommas(removeNonNumeric(e)));
  const handleChangeMortgage = (e: string) =>
    setMortgage(addCommas(removeNonNumeric(e)));

  const loadLocations = async () => {
    locationService.current
      .getAllProvinces()
      .then((fetchedProvinces) => {
        setProvinces(
          fetchedProvinces.sort((a, b) => a.name.localeCompare(b.name))
        );
        if (selectedProvince?.id) {
          const province = fetchedProvinces.find(
            (p) => p.id === selectedProvince.id
          );
          if (province) {
            setSelectedProvince({ ...province });
            setCities(() =>
              province.cities.sort((a, b) => a.name.localeCompare(b.name))
            );
            if (selectedCity?.id) {
              const city = province.cities.find((c) => c.id === selectedCity.id);
              if (city) {
                setSelectedCity({ ...city });
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
    const loadedForm = await formService.current.getForm(
      selectedDelegationType.id,
      selectedEstateType.id
    );
    setEstate({ ...estate, dataForm: loadedForm });
    setLoading(false);
  }

  // واکنش به کلیک روی نقشه + اسکرول خودکار روی موبایل
  useEffect(() => {
    if (!mapClick) return;

    const { lat, lng } = mapClick;
    console.debug("[AddEstate] mapClick received:", { lat, lng });

    // 1) ست‌کردن مختصات روی estate
    setEstate((prev) => {
      const zoomVal = prev?.mapInfo?.zoom ?? 16;
      const newMapInfo: MapInfo = {
        latitude: Number(lat),
        longitude: Number(lng),
        zoom: zoomVal,
      };

      setMapInfo(newMapInfo);
      console.debug("[AddEstate] setting estate.mapInfo =", newMapInfo);

      return {
        ...prev,
        mapInfo: newMapInfo,
      };
    });

    // اسکرول خودکار به فرم در موبایل
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }

    // 2) reverse-geocode برای آدرس
    let cancelled = false;
    (async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=fa,en`;
        const res = await fetch(url, { headers: { "User-Agent": "ssja/1.0" } });
        if (!res.ok) {
          console.warn("[AddEstate] reverse-geocode failed:", res.status);
          return;
        }
        const json = await res.json();
        const addr = json?.address || {};

        const nice = [
          addr.state,
          addr.city || addr.town || addr.village,
          addr.neighbourhood || addr.suburb || addr.city_district,
        ]
          .filter(Boolean)
          .join(" / ");

        if (!cancelled) {
          const display = nice || json.display_name || "";
          setAddressText(display);
          console.debug("[AddEstate] reverse-geocode addressText =", display);
        }
      } catch (err) {
        console.warn("[AddEstate] reverse-geocode error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mapClick]);

  async function submitEstate() {
    // الان شرط: استان + شهر + مختصات
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
    for (const [k, v] of (formData as any).entries?.() || []) {
      fd.append(k, v as any);
    }

    console.debug("[AddEstate] submitting estate object:", estate);

    fd.append("estate", JSON.stringify(estate));

    const response = await estateService.current.requestAddEtate(fd);

    if (response) {
      setSelectedProvince(defaultProvince);
      setSelectedCity(defaultCity);
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

    setSelectedProvince({
      id: provinceId,
      name: provinceId,
      cities: province.cities,
      mapInfo: province.mapInfo,
    });
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

    setSelectedCity({
      id: cityId,
      name: cityId,
      neighborhoods: city.neighborhoods,
      mapInfo: city.mapInfo,
    });
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
    setSelectedEstateType({ id: data, name: data, order: 1 });
  }

  function buildFilter() {
    const filter: SearchFilter = {
      header: {
        assignmentTypeId: selectedDelegationType.id,
        estateTypeId: selectedEstateType.id,
        provinceId: selectedProvince.id,
        cityId: selectedCity.id,
      },
      form: dataForm.id ? dataForm : undefined,
    };
    return filter;
  }

  function checkFileSizes(files: File[]): boolean {
    const sumOfFileSizes = files
      .map((f) => f.size)
      .reduce((a, b) => a + b, 0);
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
          ) : (
            <div>{/* سایر انواع فیلدها در فرم اصلی */}</div>
          )}
        </div>
      );
    });
  }

  function onFieldChange(targetValue: any, form: EstateForm, fieldIndex: number) {
    const currentField = {
      ...estate.dataForm.fields[fieldIndex],
    };
    currentField.value = targetValue;
    const newForm = {
      ...estate.dataForm,
      fields: estate.dataForm.fields.map((f, i) =>
        i === fieldIndex ? currentField : f
      ),
    };
    setEstate((prev) => ({ ...prev, dataForm: newForm }));
  }

  function closeModal() {
    if (props.closeModalHandler) props.closeModalHandler(false);
  }

  // =======================
  // UI شبیه EditEstateSideBar
  // =======================
  return (
    <div
      className={`MyScroll h-full py-5 px-14 w-96 bg-[rgba(44,62,80,.85)] overflow-y-auto flex flex-col justify-between ${
        props.width ?? ""
      }`}
    >
      <div className="space-y-4">
        {/* استان */}
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

        {/* شهر */}
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

        {/* نوع درخواست */}
        <div className="flex flex-col gap-1">
          <Select
            options={delegationTypes}
            value={selectedDelegationType.id}
            label={{
              htmlForLabler: "delegationTypes",
              titleLabel: "نوع درخواست",
              labelColor: "white",
            }}
            onChange={handleDelegationChange}
          />
        </div>

        {/* نوع ملک */}
        <div className="flex flex-col gap-1">
          <Select
            options={estateTypes}
            value={selectedEstateType.id}
            label={{
              htmlForLabler: "estateTypes",
              titleLabel: "نوع ملک",
              labelColor: "white",
            }}
            onChange={handleTypeChange}
          />
        </div>

        {/* آدرس انتخاب‌شده از روی نقشه */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white">آدرس انتخاب شده روی نقشه</label>
          <div className="text-xs text-gray-100 bg-[rgba(255,255,255,.08)] border border-white/30 rounded px-2 py-2 min-h-[40px]">
            {addressText || Strings.enterlocationInfo}
          </div>
          {!estate.mapInfo?.latitude && (
            <p className="mt-1 text-[11px] text-yellow-200">
              روی نقشه یک نقطه انتخاب کنید تا آدرس و مختصات ثبت شود.
            </p>
          )}
        </div>

        {/* نقطه شروع فرم برای اسکرول موبایل */}
        <div ref={formRef} />

        {/* مبلغ / رهن – اگر می‌خوای واقعاً ذخیره‌شان کنی، بعداً وصلشون کن به estate.dataForm */}
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-xs text-white">مبلغ (تومان)</label>
            <input
              type="text"
              className="w-full mt-1 px-2 py-1 rounded text-left text-sm"
              dir="ltr"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="مثلاً 2,500,000,000"
            />
          </div>
          <div>
            <label className="text-xs text-white">رهن / ودیعه (در صورت نیاز)</label>
            <input
              type="text"
              className="w-full mt-1 px-2 py-1 rounded text-left text-sm"
              dir="ltr"
              value={mortgage}
              onChange={(e) => handleChangeMortgage(e.target.value)}
              placeholder="مثلاً 500,000,000"
            />
          </div>
        </div>

        {/* بدنه فرم داینامیک */}
        {isDefault ? (
          <div className="flex justify-center py-4">
            <Spiner />
          </div>
        ) : loading ? (
          <div className="flex justify-center py-4">
            <Spiner />
          </div>
        ) : (
          <>
            <div className="w-full">
              {estate.dataForm?.fields?.length > 0 ? (
                mapFields(estate.dataForm.fields, estate.dataForm)
              ) : (
                <h4 className="text-white border rounded-2xl px-2 py-2 flex flex-row items-center text-sm justify-between">
                  {Strings.formDoesNotExist}
                  <BSIcon.BsFillExclamationTriangleFill />
                </h4>
              )}
            </div>
            {estate.dataForm.id && (
              <button
                className="bg-[#f3bc65] h-10 px-3  border-b-4 border-b-[#d99221] hover:border-b-[#f3bc65] w-full font-bold text-[#222222]  active:border-b-0 active:border-t-4 active:border-t-[#d99221] mt-3"
                onClick={submitEstate}
                disabled={loading}
              >
                {Strings.addEstate}
              </button>
            )}
          </>
        )}
      </div>

      {/* دکمه بستن در موبایل */}
      <div className="block md:hidden mt-4">
        <button
          onClick={closeModal}
          className="border border-white w-full h-10 px-3 flex flex-row items-center justify-center text-white gap-2 transition-all duration-200 hover:shadow-lg active:pt-2"
        >
          <RiIcon.RiCloseCircleFill className="w-5 h-5" />
          <span>بستن</span>
        </button>
      </div>

      {isShowModal && modalOption && <Modal options={modalOption} />}
    </div>
  );
};

export default AddEstateSidebar;
