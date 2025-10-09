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
function EstateTypesList() {
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [removedItems, setRemovedItems] = useState<EstateType[]>([]);
  const [newItems, setNewItems] = useState<EstateType[]>([]);
  const [newEstateType, setNewEstateType] = useState<EstateType>({
    id: "",
    name: "",
    order:0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
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
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllEstateTypes();
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
      order:modalState.order ??1 ,
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

export default EstateTypesList;
