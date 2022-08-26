import React, { FC, useState, useRef, useEffect } from "react";
import * as FiIcon from "react-icons/fi";
import * as CgIcon from "react-icons/cg";
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
interface Props {
  setCore: (mapinfo: MapInfo) => void;
}
const SidebarMap: FC<Props> = (props) => {
  const [showAdvanceFilter, setShowAdvanceFilter] = useState<boolean>(false);
  const [isHideSideBar, setIsHideSidebar] = useState<boolean>(false);
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
        console.log(Strings.loadingLocationsFailed);

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
  function handleProvinceChange(provinceId: string) {
    // console.log(provinceId);

    const province = provinces.find((p) => p.id === provinceId);
    console.log(province);
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

  function handleDelegationChange(event: string) {
    // console.log(event.currentTarget.value);

    setSelectedDelegationType({
      id: event,
      name: event,
    });
  }
  return (
    <div
      className={`relative transition-all duration-150 ease-out  ${
        isHideSideBar ? "w-10 px-0" : "w-56 md:w-80 px-5 md:px-14"
      }  h-full bg-[rgba(44,62,80,.85)] z-20 -top-[100%] py-5   text-sm  overflow-y-auto `}
    >
      <div
        className={`flex flex-row  ${
          isHideSideBar ? "justify-center" : "justify-end"
        }  items-center`}
      >
        <button
          onClick={() => setIsHideSidebar((prev) => !prev)}
          className="border"
        >
          <CgIcon.CgArrowsShrinkH className="text-white w-6 h-6" />
        </button>
      </div>
      <div className={`space-y-4 ${isHideSideBar ? "hidden" : "block"}`}>
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
          {/* <label htmlFor="province" className="text-white">
            استان
          </label>
          <select name="" id="province" defaultValue="1">
            <option value="1" disabled>
              انتخاب کنید
            </option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select> */}
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
          {/* <label htmlFor="county" className="text-white">
            شهرستان
          </label>
          <select name="" id="county" defaultValue="2">
            <option value="2" disabled>
              انتخاب کنید
            </option>
            <option value="">مهاباد</option>
            <option value="">سنندج</option>
            <option value="">سقز</option>
          </select> */}
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
          {/* <label htmlFor="county" className="text-white">
            شهرستان
          </label>
          <select name="" id="county" defaultValue="2">
            <option value="2" disabled>
              انتخاب کنید
            </option>
            <option value="">مهاباد</option>
            <option value="">سنندج</option>
            <option value="">سقز</option>
          </select> */}
        </div>
        <div className="flex flex-col gap-1">
          <Select
            options={delegationTypes}
            defaultValue=""
            label={{
              htmlForLabler: "neighborhoods",
              titleLabel: "نوع درخواست",
              labelColor: "white",
            }}
            onChange={handleDelegationChange}
          />
          {/* <label htmlFor="county" className="text-white">
            شهرستان
          </label>
          <select name="" id="county" defaultValue="2">
            <option value="2" disabled>
              انتخاب کنید
            </option>
            <option value="">مهاباد</option>
            <option value="">سنندج</option>
            <option value="">سقز</option>
          </select> */}
        </div>
        {/* <div className="flex flex-col gap-1">
          <label htmlFor="region" className="text-white">
            منطقه
          </label>
          <select name="" id="region" defaultValue="3">
            <option value="3" disabled>
              انتخاب کنید
            </option>
            <option value="">پشت تپ</option>
            <option value="">زمینهای شهرداری</option>
            <option value="">تپه قاضی</option>
          </select>
        </div> */}
        {/* <div className="flex flex-col gap-1" defaultValue="">
          <label htmlFor="request" className="text-white">
            نوع درخواست
          </label>
          <select name="" id="request" defaultValue="1">
            <option value="1" disabled>
              انتخاب کنید
            </option>
            <option value="">رهن</option>
            <option value="">اجاره</option>
            <option value="">فروش</option>
          </select>
        </div> */}
        <div className="flex flex-col gap-1" defaultValue="1">
          <label htmlFor="property" className="text-white">
            نوع ملک
          </label>
          <select name="" id="property" defaultValue="1">
            <option value="1" disabled>
              انتخاب کنید
            </option>
            <option value="">آپارتمان</option>
            <option value="">ویلایی</option>
            <option value="">باغ</option>
          </select>
        </div>

        <button
          onClick={() => setShowAdvanceFilter((prev) => !prev)}
          className="border border-white w-full h-10 px-3 flex flex-row items-center justify-center text-white gap-2 transition-all duration-200 hover:shadow-lg active:pt-2"
        >
          <FiIcon.FiFilter className="w-5 h-5" />
          <span>فیلتر پیشرفته</span>
        </button>
        {showAdvanceFilter && (
          <div className="w-full h-[500px] bg-red-600 z-20"></div>
        )}
        <button className="bg-[#f3bc65] h-10 px-3  border-b-4 border-b-[#d99221] hover:border-b-[#f3bc65] w-full font-bold text-[#222222]  active:border-b-0 active:border-t-4 active:border-t-[#d99221] mt-3">
          جستجو
        </button>
      </div>
    </div>
  );
};

export default SidebarMap;
