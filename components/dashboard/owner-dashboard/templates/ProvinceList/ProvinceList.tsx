import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import { defaultMapInfo } from "../../../../../global/types/MapInfo";
import Province from "../../../../../global/types/Province";
import LocationService from "../../../../../services/api/LocationService/LocationService";
import EditItemModal from "../../../../EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "../../../../EditItemModal/EditItemModalState";
import * as AiIcon from "react-icons/ai";
import * as BiIcon from "react-icons/bi";
import * as MdIcon from "react-icons/md";
import Spiner from "../../../../spinner/Spiner";
import React from "react";
function ProvinceList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [removedItems, setRemovedItems] = useState<Province[]>([]);
  const [newItems, setNewItems] = useState<Province[]>([]);
  const [newProvince, setNewProvince] = useState<Province>({
    id: "",
    name: "",
    cities: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new LocationService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    service.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.Province]) {
      editProvince();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Province]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllProvinces();

    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }

    setProvinces(data);
    setLoading((prev) => false);
  };

  const selectItemAsRemoved = (province: Province) => {
    setRemovedItems((prev) => {
      let prov = prev.find((item) => item.id === province.id);
      if (prov) {
        const newRemovedItems = prev.filter((item) => item.id !== province.id);
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, province];
        return newRemovedItems;
      }
    });
  };

  const createNewProvinces = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const province = newItems[i];
      await service.current.createProvince(province);
    }
  };

  const editProvince = async () => {
    if (modalState.id === "") return;

    let province = provinces.find((p) => p.id === modalState.id);

    setLoading((prev) => true);

    if (province) {
      let newType = await service.current.editProvince({
        id: modalState.id,
        name: modalState.value,
        cities: province !== undefined ? province.cities : [],
        mapInfo: modalState.mapInfo,
      });

      if (newType) {
        setProvinces((prev) => {
          let prevType = prev.find((t) => t.id === newType!.id);

          if (prevType) {
            prevType.name = newType!.name;
            prevType.mapInfo = newType?.mapInfo;
          }

          return prev;
        });
      }
    }

    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteProvinces = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const province = removedItems[i];
      await service.current.deleteProvince(province.id);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteProvinces();
    await createNewProvinces();
    await loadData();
  };

  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.province}
        editItemType={EditItemType.Province}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">
          {Strings.provinces}{" "}
          <span className="text-dark-blue/30 text-sm">
            (<span>تعداد</span>
            <span>{provinces.length}</span>)
          </span>
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

      <div className="my-5 flex flex-col gap-7 justify-between">
        <div className="">
          {loading ? (
            <Spiner />
          ) : (
            <ul className="flex flex-row flex-wrap gap-2">
              {provinces.map((province, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find((item) => item.id === province.id)
                          ? "bg-red-100 text-red-800 hover:text-white text-sm hover:bg-red-800"
                          : "bg-[#f6f6f6]/60 text-dark-blue text-sm "
                      }  cursor-default transition-all duration-200`}
                      // title={delegationType.name}
                      // onRemove={() => {
                      //   selectItemAsDeleted(delegationType);
                      // }}
                      // onEdit={() => {
                      //   const newMap = buildMap(EditItemType.DelegationType);
                      //   setModalState({
                      //     ...defaultEditItemModalState,
                      //     id: delegationType.id,
                      //     value: delegationType.name,
                      //     displayMap: [...newMap],
                      //   });
                      // }}
                    >
                      <span className="font-bold">{province.name}</span>
                      <div className="flex flex-row gap-1">
                        <span
                          onClick={() => {
                            const newMap = buildMap(EditItemType.Province);
                            setModalState({
                              ...defaultEditItemModalState,
                              id: province.id,
                              value: province.name,
                              displayMap: [...newMap],
                              mapInfo: province.mapInfo,
                            });
                          }}
                          title="ویرایش"
                          className="border  p-1 rounded-full hover:bg-[#f3bc65] cursor-pointer"
                        >
                          <BiIcon.BiEditAlt className="text-gray-400 hover:text-white" />
                        </span>
                        <span
                          onClick={() => {
                            selectItemAsRemoved(province);
                          }}
                          title="حذف"
                          className="border p-1 rounded-full hover:bg-red-700 cursor-pointer"
                        >
                          <MdIcon.MdOutlineRemove className="text-gray-400 hover:text-white" />
                        </span>
                      </div>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-row">
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
                      setNewItems((prev) =>
                        prev.filter((_, id) => id !== index)
                      );
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
      </div>
      <div className="flex flex-row w-full gap-[2px] items-center">
        <div className="flex-1 flex flex-row gap-[2px] items-center">
          <input
            type="text"
            className="inputDecoration"
            placeholder={Strings.addNewProvince}
            value={newProvince.name}
            onChange={(e) => {
              setNewProvince({
                ...newProvince,
                name: e.target.value,
              });
            }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              newProvince.name.trim() !== "" &&
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newProvince,
                    name: newProvince.name.trim(),
                  },
                ]);
              setNewProvince({
                ...newProvince,
                name: "",
              });
            }}
          >
            <AiIcon.AiOutlinePlus className="text-2xl transition-all text-[#f3bc65] group-hover:text-white" />
          </button>
        </div>

        <div className="flex flex-col"></div>
      </div>
    </div>
  );
}

export default ProvinceList;
