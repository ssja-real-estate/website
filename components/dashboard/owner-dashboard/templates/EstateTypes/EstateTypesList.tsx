import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalState } from "../../../../../global/states/globalStates";
import EstateType from "../../../../../global/types/EstateType";
import EstateTypeService from "../../../../../services/api/EstateTypeService/EstateTypeService";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "../../../../EditItemModal/EditItemModalState";
import Spiner from "../../../../spinner/Spiner";
import * as AiIcon from "react-icons/ai";
import * as BiIcon from "react-icons/bi";
import * as MdIcon from "react-icons/md";
import Strings from "../../../../../data/strings";
import EditItemModal from "../../../../EditItemModal/EditItemModal";
import React from "react";
import GlobalState from "../../../../../global/states/GlobalState";
function EstateTypesList() {
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [removedItems, setRemovedItems] = useState<EstateType[]>([]);
  const [newItems, setNewItems] = useState<EstateType[]>([]);
  const [newEstateType, setNewEstateType] = useState<EstateType>({
    id: "",
    name: "",
    order:1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue<GlobalState>(globalState);
  const service = useRef(new EstateTypeService());
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

    if (modalState.editMap[EditItemType.EstateType]) {
      editEstateType();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.EstateType]]);

  const loadData = async () => {
    console.log("*****************************************");
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllEstateTypes();
    console.log("Data=",data);
    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }

    setEstateTypes(data);
    setLoading((prev) => false);
  };

  const selectItemAsDeleted = (estateType: EstateType) => {
    setRemovedItems((prev) => {
      const type = prev.find((item) => item.id === estateType.id);
      if (type) {
        const newRemovedItems = prev.filter(
          (item) => item.id !== estateType.id
        );
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, estateType];
        return newRemovedItems;
      }
    });
  };

  const createNewEstateTypes = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const element = newItems[i];
      await service.current.createEstateType(element);
    }
  };

  const editEstateType = async () => {
    if (modalState.id === "") return;

    setLoading((prev) => true);
    let newType = await service.current.editEstateType({
      id: modalState.id,
      name: modalState.value,
      order:modalState.order ??1,
    });

    if (newType) {
      setEstateTypes((types) => {
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

  const deleteEstateTypes = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const element = removedItems[i];
      await service.current.deleteEstateType(element.id);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteEstateTypes();
    await createNewEstateTypes();
    await loadData();
  };

  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.delegationType}
        editItemType={EditItemType.EstateType}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">
          {Strings.estateTypes}
        </h4>
     
      </div>

      <div className="my-5 flex flex-col gap-7 justify-between">
        <div className="">
          {loading ? (
            <Spiner />
          ) : (
            <ul className="flex flex-row flex-wrap gap-2">
         
              {estateTypes.map((estateType, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find((item) => item.id === estateType.id)
                          ? "bg-red-100 text-red-800 hover:text-white text-sm hover:bg-red-800"
                          : "bg-[#f6f6f6]/60 text-dark-blue text-sm "
                      }  cursor-default transition-all duration-200`}
                  
                    >
                      <span className="font-bold">{estateType.name}</span>
                      <div className="flex flex-row gap-1">
                        <span
                          onClick={() => {
                            const newMap = buildMap(EditItemType.EstateType);
                            setModalState({
                              ...defaultEditItemModalState,
                              id: estateType.id,
                              value: estateType.name,
                              order:estateType.order??1,
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
                            selectItemAsDeleted(estateType);
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
            placeholder={Strings.addNewEstateType}
            value={newEstateType.name}
            onChange={(e) => {
              setNewEstateType({
                ...newEstateType,
                name: e.target.value,
              });
            }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              newEstateType.name.trim() !== "" &&
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newEstateType,
                    name: newEstateType.name.trim(),
                  },
                ]);
              setNewEstateType({
                ...newEstateType,
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

export default EstateTypesList;
