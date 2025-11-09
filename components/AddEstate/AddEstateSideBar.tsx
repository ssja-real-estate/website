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

  // -------------------------------
  // ===  این useEffect جدید  ===
  // پس از خط: const mapClick = useRecoilValue(mapClickState);
  // -------------------------------
  useEffect(() => {
    // وقتی mapClick خالیه کاری نکن
    if (!mapClick) return;

    const { lat, lng } = mapClick;
    console.debug("[AddEstate] mapClick received:", { lat, lng });

    // 1) ست کردن estate.mapInfo و mapInfo محلی
    setEstate((prev) => {
      const zoomVal = prev?.mapInfo?.zoom ?? 16; // اگر zoom قبلی نبود 16 بذار
      const newMapInfo: MapInfo = {
        latitude: Number(lat),
        longitude: Number(lng),
        zoom: zoomVal,
      };

      setMapInfo(newMapInfo); // برای نمایش محلی
      console.debug("[AddEstate] setting estate.mapInfo =", newMapInfo);

      return {
        ...prev,
        mapInfo: newMapInfo,
      };
    });

    // 2) reverse-geocode با Nominatim برای پر کردن addressText (فارسی یا انگلیسی)
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
  // -------------------------------

  async function submitEstate() {
    // حالا به جای «Select منطقه»، آدرس و مختصات الزامی‌اند
    const hasCoords = !!(estate.mapInfo?.latitude && estate.mapInfo?.longitude);
    if (!selectedProvince.id || !selectedCity.id || !hasCoords) {
      setIsShowModal(true);
      setModalOption({
        message: Strings.enterlocationInfo, // <-- اصلاح‌شده
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

    // برای باگ‌فری بودن، لاگ‌کردن estate قبل از ارسال
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
    setSelectedEstateType({ id: data, name: data, order: 1 });
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
          ) : (
            <div>{/* سایر انواع فیلدها (مثلاً Select, Range و ... ) در کد اصلی شما هست */}</div>
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
    const newForm = { ...estate.dataForm, fields: estate.dataForm.fields.map((f, i) => (i === fieldIndex ? currentField : f)) };
    setEstate((prev) => ({ ...prev, dataForm: newForm }));
  }

  return (
    <div className={`p-4 ${props.width ?? ""}`}>
      {/* یک UI ساده که فرم و دکمه ارسال را نمایش می‌دهد.
          قالب کامل UI در فایل اصلیِ پروژه‌ات وجود دارد؛ اینجا تنها بخش کلیدی برای ارسال قرار داده شده است. */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">آدرس انتخاب شده</label>
        <div className="mt-1 text-sm text-gray-600">{addressText || Strings.enterlocationInfo}</div>
      </div>

      {/* در کد اصلی شما فرم پیچیده‌تری هست؛ اینجا فقط دکمه ارسال اضافه شده است */}
      <div className="mt-4">
        <button
          onClick={() => submitEstate()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading || isDefault}
        >
          {loading ? <Spiner /> : "ارسال ملک"}
        </button>
      </div>

      {/* modal ها، پیام‌ها و سایر بخش‌ها در فایل پروژهٔ اصلی هستند */}
      {isShowModal && (
        <Modal
          options={{
            message: modalOption?.message ?? "",
            icon: modalOption?.icon,
            closeModal: () => {
              setIsShowModal(false);
              modalOption?.closeModal && modalOption.closeModal();
            },
          }}
        />
      )}
    </div>
  );
};

export default AddEstateSidebar;
