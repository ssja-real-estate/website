import React, { FC, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import DelegationType from "../../../../../global/types/DelegationType";
import DelegationTypeService from "../../../../../services/api/DelegationTypeService/DelegationTypeService";
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
const DelegationTypesList: FC = () => {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [removedItems, setRemovedItems] = useState<DelegationType[]>([]);
  const [newItems, setNewItems] = useState<DelegationType[]>([]);
  const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new DelegationTypeService());
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
    if (modalState.editMap[EditItemType.DelegationType]) {
      editDelegationType();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.DelegationType]]);

  const loadData = async () => {
    setDelegationTypes([]);
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllDelegationTypes();

    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }

    setDelegationTypes(data);
    console.log(data);

    setLoading((prev) => false);
  };

  const selectItemAsDeleted = (delegationType: DelegationType) => {
    setRemovedItems((prev) => {
      let type = prev.find((item) => item.id === delegationType.id);
      let newRemovedItems = [];
      if (type) {
        newRemovedItems = prev.filter((item) => item.id !== delegationType.id);
        return newRemovedItems;
      } else {
        newRemovedItems = [...prev, delegationType];
        return newRemovedItems;
      }
    });
  };

  const createNewDelegationTypes = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const element = newItems[i];
      await service.current.createDelegationType(element);
    }
  };

  const editDelegationType = async () => {
    if (modalState.id === "") return;

    setLoading((prev) => true);
    let newType = await service.current.editDelegationType({
      id: modalState.id,
      name: modalState.value,
    });

    if (newType) {
      setDelegationTypes((types) => {
        let prevType = types.find((t) => t.id === newType!.id);
        if (prevType) {
          prevType.name = newType!.name;
        }
        return types;
      });
    }
    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteDelegationTypes = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const element = removedItems[i];
      await service.current.deleteDelegationType(element.id);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteDelegationTypes();
    await createNewDelegationTypes();
    await loadData();
  };
  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.delegationType}
        editItemType={EditItemType.DelegationType}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">
          {Strings.delegationTypes}
        </h4>
        <button
          className="refresh-btn d-inline rounded-circle"
          onClick={async () => {
            await loadData();
          }}
        >
          refresh
        </button>
      </div>

      <div className="my-5 flex flex-col gap-7 justify-between">
        <div className="">
          {loading ? (
            <Spiner />
          ) : (
            <ul className="flex flex-row flex-wrap gap-2">
              {delegationTypes.map((delegationType, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find(
                          (item) => item.id === delegationType.id
                        )
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
                      <span className="font-bold">{delegationType.name}</span>
                      <div className="flex flex-row gap-1">
                        <span
                          onClick={() => {
                            const newMap = buildMap(
                              EditItemType.DelegationType
                            );
                            setModalState({
                              ...defaultEditItemModalState,
                              id: delegationType.id,
                              value: delegationType.name,
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
                            selectItemAsDeleted(delegationType);
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
            placeholder={Strings.addNewDelegationType}
            value={newDelegationType.name}
            onChange={(e) => {
              setNewDelegationType({
                ...newDelegationType,
                name: e.target.value,
              });
            }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              newDelegationType.name.trim() !== "" &&
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newDelegationType,
                    name: newDelegationType.name.trim(),
                  },
                ]);
              setNewDelegationType({
                ...newDelegationType,
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
};

export default DelegationTypesList;
