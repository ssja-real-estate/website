import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import Unit from "../../../../../global/types/Unit";
import UnitService from "../../../../../services/api/UnitService/UnitService";
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
import React from "react";

function UnitList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [removedItems, setRemovedItems] = useState<Unit[]>([]);
  const [newItems, setNewItems] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState<Unit>({
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new UnitService());
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
    if (modalState.editMap[EditItemType.Unit]) {
      editUnit();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Unit]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const units = await service.current.getAllUnits();

    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }
    setUnits(units);
    setLoading((prev) => false);
  };

  const selectItemAsDeleted = (unit: Unit) => {
    setRemovedItems((prev) => {
      const existingItem = prev.find((e) => e.id === unit.id);

      if (existingItem) {
        const newRemovedItems = prev.filter((item) => item.id !== unit.id);
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, unit];
        return newRemovedItems;
      }
    });
  };

  const createNewUnits = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const unit = newItems[i];
      await service.current.createUnit(unit);
    }
  };

  const editUnit = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let updatedUnit = await service.current.editUnit({
      id: modalState.id,
      name: modalState.value,
    });

    if (updatedUnit) {
      setUnits((prev) => {
        let prevTypeIndex = prev.findIndex((t) => t.id === updatedUnit!.id);
        if (prevTypeIndex !== -1) {
          let prevType = prev[prevTypeIndex];
          if (prevType) {
            prevType.name = updatedUnit?.name ?? prevType.name;
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

  const deleteUnits = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const unit = removedItems[i];
      await service.current.deleteUnit(unit.id);
    }
  };
  const saveChanges = async () => {
    await deleteUnits();
    await createNewUnits();
    await loadData();
  };

  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.unit}
        editItemType={EditItemType.Unit}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">{Strings.units}</h4>
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
              {units.map((unit, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find((item) => item.id === unit.id)
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
                      <span className="font-bold">{unit.name}</span>
                      {/* <div className="flex flex-row gap-1">
                        <span
                          onClick={() => {
                            const newMap = buildMap(EditItemType.Unit);
                            setModalState({
                              ...defaultEditItemModalState,
                              id: unit.id,
                              value: unit.name,
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
                            selectItemAsDeleted(unit);
                          }}
                          title="حذف"
                          className="border p-1 rounded-full hover:bg-red-700 cursor-pointer"
                        >
                          <MdIcon.MdOutlineRemove className="text-gray-400 hover:text-white" />
                        </span>
                      </div> */}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>
        {/* <div className="flex flex-row">
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
        </div> */}
      </div>
      {/* <div className="flex flex-row w-full gap-[2px] items-center">
        <div className="flex-1 flex flex-row gap-[2px] items-center">
          <input
            type="text"
            className="inputDecoration"
            placeholder={Strings.addNewUnit}
            value={newUnit.name}
            onChange={(e: { target: { value: any } }) => {
              setNewUnit({
                ...newUnit,
                name: e.target.value,
              });
            }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              newUnit.name.trim() !== "" &&
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newUnit,
                    name: newUnit.name.trim(),
                  },
                ]);
              setNewUnit({
                ...newUnit,
                name: "",
              });
            }}
          >
            <AiIcon.AiOutlinePlus className="text-2xl transition-all text-[#f3bc65] group-hover:text-white" />
          </button>
        </div>

        <div className="flex flex-col"></div>
      </div> */}
    </div>
  );
}

export default UnitList;
