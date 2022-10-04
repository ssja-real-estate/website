import React from "react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import City from "../../../../../global/types/City";
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
function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [removedItems, setRemovedItems] = useState<City[]>([]);
  const [newItems, setNewItems] = useState<City[]>([]);
  const [newCity, setNewCity] = useState<City>({
    id: "",
    name: "",
    neighborhoods: [],
  });
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    locationService.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.City]) {
      editCity();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.City]]);

  const loadProvinces = async () => {
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
            setCities((prev) => province.cities.reverse());
          }
        } else {
          setSelectedProvince(defaultProvince);
        }
      })
      .catch((_) => {
        // toast.error(Strings.loadingLocationsFailed);
        alert(Strings.loadingLocationsFailed);
      });
  };

  const loadData = async () => {
    setCities([]);
    if (!loading) {
      setLoading((prev) => true);
    }

    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }

    await loadProvinces();

    setLoading((prev) => false);
  };

  const selectItemAsDeleted = async (city: City) => {
    setRemovedItems((prev) => {
      const item = prev.find((e) => e.id === city.id);
      if (item) {
        const newRemovedItems = prev.filter((item) => item.id !== city.id);
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, city];
        return newRemovedItems;
      }
    });
  };

  const createNewCities = async () => {
    const provinceId = selectedProvince?.id;
    if (!provinceId) return;
    for (let i = 0; i < newItems.length; i++) {
      const city = newItems[i];
      await locationService.current.createCityInProvince(provinceId, city);
    }
  };

  const editCity = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let provinceId = selectedProvince?.id ?? "";
    let updatedCity = await locationService.current.editCityInProvince(
      provinceId,
      {
        id: modalState.id,
        name: modalState.value,
        neighborhoods: [],
        mapInfo: modalState.mapInfo,
      }
    );
    if (updatedCity) {
      setProvinces((prev) => {
        let prevProvince = prev.find((t) => t.id === provinceId);
        if (prevProvince) {
          let prevCity = prevProvince.cities.find(
            (c) => c.id === updatedCity!.id
          );
          if (prevCity) {
            prevCity.name = updatedCity!.name;
            prevCity.mapInfo = updatedCity?.mapInfo;
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

  const deleteCities = async () => {
    const provinceId = selectedProvince?.id;
    alert(provinceId);
    if (!provinceId) return;
    for (let i = 0; i < removedItems.length; i++) {
      const city = removedItems[i];
      try {
        await locationService.current.deleteCityInProvince(provinceId, city);
      } catch (error) {
        alert(error);
      }
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteCities();
    await createNewCities();
    await loadData();
  };

  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.city}
        editItemType={EditItemType.City}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">{Strings.cities}</h4>
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
        <div className="w-full flex flex-row gap-[2px] items-center justify-center mt-4">
          <select
            className="selectbox w-[47.5%]"
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
            <option value="default">{Strings.chooseProvince}</option>
            {provinces.map((province, index) => {
              return (
                <option key={index} value={province.id}>
                  {province.name}
                </option>
              );
            })}
          </select>
          {/* <input
            type="text"
            className="inputDecoration w-[47.5%]"
            placeholder={Strings.addNewCity}
            value={newCity.name}
            onChange={(e) => {
              setNewCity({
                ...newCity,
                name: e.target.value,
              });
            }}
          /> */}
          {/* <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              newCity.name.trim() !== "" &&
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newCity,
                    name: newCity.name.trim(),
                  },
                ]);
              setNewCity({
                ...newCity,
                name: "",
              });
            }}
          >
            <AiIcon.AiOutlinePlus className="text-2xl transition-all text-[#f3bc65] group-hover:text-white" />
          </button> */}
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
        {/* {(newItems.length > 0 || removedItems.length > 0) && (
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
        )} */}
      </div>
      <div className="my-5 flex flex-col gap-7 justify-between">
        <div className="">
          {loading ? (
            <Spiner />
          ) : (
            <ul className="flex flex-row flex-wrap gap-2">
              {cities.map((city, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find((item) => item.id === city.id)
                          ? "bg-red-100 text-red-800 hover:text-white text-sm hover:bg-red-800"
                          : "bg-[#f6f6f6]/60 text-dark-blue text-sm "
                      }  cursor-default transition-all duration-200`}
                    >
                      <span className="font-bold">{city.name}</span>
                      {cities && (
                        <div className="flex flex-row gap-1">
                          {/* <span
                            onClick={() => {
                              const newMap = buildMap(EditItemType.City);
                              console.log(newMap);

                              setModalState({
                                ...defaultEditItemModalState,
                                id: city.id,
                                value: city.name,
                                displayMap: [...newMap],
                              });
                            }}
                            title="ویرایش"
                            className="border  p-1 rounded-full hover:bg-[#f3bc65] cursor-pointer"
                          >
                            <BiIcon.BiEditAlt className="text-gray-400 hover:text-white" />
                          </span>
                          <span
                            onClick={() => {
                              selectItemAsDeleted(city);
                            }}
                            title="حذف"
                            className="border p-1 rounded-full hover:bg-red-700 cursor-pointer"
                          >
                            <MdIcon.MdOutlineRemove className="text-gray-400 hover:text-white" />
                          </span> */}
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

export default CityList;
