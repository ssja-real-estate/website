import React from "react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import City, { defaultCity } from "../../../../../global/types/City";
import Neighborhood from "../../../../../global/types/Neighborhood";
import Province, {
  defaultProvince,
} from "../../../../../global/types/Province";
import LocationService from "../../../../../services/api/LocationService/LocationService";
import EditItemModal from "../../../../EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "../../../../EditItemModal/EditItemModalState";
import Spiner from "../../../../spinner/Spiner";
import * as AiIcon from "react-icons/ai";
import * as BiIcon from "react-icons/bi";
import * as MdIcon from "react-icons/md";
import CityList from "../CityList/CityList";
function NeighborhoodList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [removedItems, setRemovedItems] = useState<Neighborhood[]>([]);
  const [newItems, setNewItems] = useState<Neighborhood[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<Province>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);
  const [newNeighborhood, setNewNeighborhood] = useState<Neighborhood>({
    id: "",
    name: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    locationService.current.setToken(state.token);
    loadLocations();
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.Neighborhood]) {
      editNeighborhood();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Neighborhood]]);

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
            setSelectedProvince(province);
            setCities((prev) => province.cities);
            if (selectedCity?.id) {
              const city = province.cities.find(
                (c) => c.id === selectedCity.id
              );
              if (city) {
                setSelectedCity(city);
                setNeighborhoods(city.neighborhoods.reverse());
              }
            }
          }
        } else {
          setSelectedProvince(defaultProvince);
          setSelectedCity(defaultCity);
        }
      })
      .catch((_) => {
        // toast.error(Strings.loadingLocationsFailed);
        alert(Strings.loadingLocationsFailed);
      });
  };

  const loadData = async () => {
    setNeighborhoods([]);
    if (!loading) {
      setLoading((prev) => true);
    }
    await loadLocations();
    setLoading((prev) => false);
    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }
  };

  const selectItemAsDeleted = async (neighborhood: Neighborhood) => {
    setRemovedItems((prev) => {
      const item = prev.find((e) => e.id === neighborhood.id);
      if (item) {
        const newRemovedItems = prev.filter(
          (item) => item.id !== neighborhood.id
        );
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, neighborhood];
        return newRemovedItems;
      }
    });
  };

  const createNewNeighborhoods = async () => {
    const provinceId = selectedProvince?.id;
    const cityId = selectedCity?.id;
    if (!provinceId || !cityId) return;
    for (let i = 0; i < newItems.length; i++) {
      const neighborhood = newItems[i];
      await locationService.current.createNeighborhoodInCity(
        provinceId,
        cityId,
        neighborhood
      );
    }
  };

  const editNeighborhood = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let provinceId = selectedProvince?.id;
    let cityId = selectedCity?.id;

    if (!provinceId || !cityId) return;

    let updatedNeighborhood =
      await locationService.current.editNeighborhoodInCity(provinceId, cityId, {
        id: modalState.id,
        name: modalState.value,
        mapInfo: modalState.mapInfo,
      });

    if (updatedNeighborhood) {
      setCities((prev) => {
        let prevCity = prev.find((t) => t.id === cityId);
        if (prevCity) {
          let prevNeighborhood = prevCity.neighborhoods.find(
            (c) => c.id === updatedNeighborhood!.id
          );
          if (prevNeighborhood) {
            prevNeighborhood.name = updatedNeighborhood!.name;
            prevNeighborhood.mapInfo = updatedNeighborhood?.mapInfo;
          }
        }
        return prev;
      });
    }
    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteNeighborhoods = async () => {
    const provinceId = selectedProvince?.id;
    const cityId = selectedCity?.id;
    if (!provinceId || !cityId) return;
    for (let i = 0; i < removedItems.length; i++) {
      const neighborhood = removedItems[i];
      await locationService.current.deleteNeighborhoodInCity(
        provinceId,
        cityId,
        neighborhood.id
      );
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteNeighborhoods();
    await createNewNeighborhoods();
    await loadData();
  };

  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.neighborhood}
        editItemType={EditItemType.Neighborhood}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">
          {Strings.neighborhoods}
        </h4>
        {/* <button
          className="refresh-btn d-inline rounded-circle"
          onClick={async () => {
            await loadData();
          }}
        >
          refresh
        </button> */}
      </div>
      <div className="flex flex-row w-full gap-[2px] items-center">
        <div className="w-full flex flex-row gap-[2px] items-center">
          <select
            className="selectbox w-[32%]"
            defaultValue="default"
            value={selectedProvince?.id}
            onChange={(e: { currentTarget: { value: any } }) => {
              const provinceId = e.currentTarget.value;
              if (provinceId) {
                const province = provinces.find((p) => p.id === provinceId);
                if (province) {
                  setSelectedProvince(province);
                  setCities(province.cities);
                }
              }
            }}
          >
            <option value="default" disabled>
              {Strings.chooseProvince}
            </option>
            {provinces.map((province, index) => {
              return (
                <option key={index} value={province.id}>
                  {province.name}
                </option>
              );
            })}
          </select>
          <select
            className="selectbox w-[32%]"
            value={selectedCity?.id}
            onChange={(e) => {
              const cityId = e.currentTarget.value;
              if (cityId) {
                const city = cities.find((c) => c.id === cityId);
                if (city) {
                  setSelectedCity({ ...city, id: city.id, name: city.id });
                  setNeighborhoods(city.neighborhoods);
                }
              }
            }}
          >
            <option value="" disabled>
              {Strings.chooseCity}
            </option>
            {cities.map((city, index) => {
              return (
                <option key={index} value={city.id}>
                  {city.name}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            className="inputDecoration w-[32%]"
            placeholder={Strings.addNewNeighborhood}
            value={newNeighborhood.name}
            onChange={(e) => {
              setNewNeighborhood({
                ...newNeighborhood,
                name: e.target.value,
              });
            }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              newNeighborhood.name.trim() !== "" &&
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newNeighborhood,
                    name: newNeighborhood.name.trim(),
                  },
                ]);
              setNewNeighborhood({
                ...newNeighborhood,
                name: "",
              });
            }}
          >
            <AiIcon.AiOutlinePlus className="text-2xl transition-all text-[#f3bc65] group-hover:text-white" />
          </button>
        </div>
      </div>
      <div className="flex flex-row mt-5">
        <ul className="flex-1 flex flex-row flex-wrap gap-2">
          {newItems.map((newItem, index) => {
            return (
              <li
                key={index}
                className="flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 bg-[#d99221]/60 text-dark-blue text-sm hover:bg-[#d99221] cursor-default transition-all duration-200"
              >
                {newItem.name}

                <span
                  onClick={() => {
                    setNewItems((prev) => prev.filter((_, id) => id !== index));
                  }}
                  title="حذف"
                  className="border border-white p-1 rounded-full hover:bg-red-700 cursor-pointer"
                >
                  <MdIcon.MdOutlineRemove className="text-white" />
                </span>
              </li>
            );
          })}
        </ul>
        {(newItems.length > 0 || removedItems.length > 0) && (
          <button
            className="text-sm bg-[#d99221] text-white h-9 px-2"
            onClick={async () => {
              await saveChanges();
              setNewItems([]);
              setRemovedItems([]);
            }}
          >
            {Strings.saveChanges}
          </button>
        )}
      </div>
      <div className="my-5 flex flex-col gap-7 justify-between">
        <div className="">
          {loading ? (
            <Spiner />
          ) : (
            <ul className="flex flex-row flex-wrap gap-2">
              {neighborhoods.map((neighborhood, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find((item) => item.id === neighborhood.id)
                          ? "bg-red-100 text-red-800 hover:text-white text-sm hover:bg-red-800"
                          : "bg-[#f6f6f6]/60 text-dark-blue text-sm "
                      }  cursor-default transition-all duration-200`}
                    >
                      <span className="font-bold">{neighborhood.name}</span>
                      {cities && (
                        <div className="flex flex-row gap-1">
                          <span
                            onClick={() => {
                              const newMap = buildMap(
                                EditItemType.Neighborhood
                              );
                              console.log(newMap);

                              setModalState({
                                ...defaultEditItemModalState,
                                id: neighborhood.id,
                                value: neighborhood.name,
                                displayMap: [...newMap],
                                mapInfo: neighborhood.mapInfo,
                              });
                            }}
                            title="ویرایش"
                            className="border  p-1 rounded-full hover:bg-[#f3bc65] cursor-pointer"
                          >
                            <BiIcon.BiEditAlt className="text-gray-400 hover:text-white" />
                          </span>
                          <span
                            onClick={() => {
                              selectItemAsDeleted(neighborhood);
                            }}
                            title="حذف"
                            className="border p-1 rounded-full hover:bg-red-700 cursor-pointer"
                          >
                            <MdIcon.MdOutlineRemove className="text-gray-400 hover:text-white" />
                          </span>
                        </div>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default NeighborhoodList;
