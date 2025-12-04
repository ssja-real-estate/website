import React, { FC, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import DelegationType from "../../../../../global/types/DelegationType";
import DelegationTypeService from "../../../../../services/api/DelegationTypeService/DelegationTypeService";
import EditItemModal from "../../../../EditItemModal/EditItemModal";
import editItemModalState, {
  defaultEditItemModalState,
  EditItemType,
} from "../../../../EditItemModal/EditItemModalState";
import Spiner from "../../../../spinner/Spiner";
import GlobalState from "../../../../../global/states/GlobalState";

const DelegationTypesList: FC = () => {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [removedItems, setRemovedItems] = useState<DelegationType[]>([]);
  const [newItems, setNewItems] = useState<DelegationType[]>([]);
  const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
    id: "",
    name: "",
    // 🔹 فیلد جدید برای ترتیب
    order: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue<GlobalState>(globalState);
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
      setLoading(true);
    }
    const data = await service.current.getAllDelegationTypes();

    if (!mounted.current) {
      setLoading(false);
      return;
    }

    // اگر خواستی اینجا هم براساس order مرتب کن:
    // data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    setDelegationTypes(data);
    console.log(data);

    setLoading(false);
  };

  const selectItemAsDeleted = (delegationType: DelegationType) => {
    setRemovedItems((prev) => {
      const exists = prev.find((item) => item.id === delegationType.id);
      if (exists) {
        return prev.filter((item) => item.id !== delegationType.id);
      }
      return [...prev, delegationType];
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

    setLoading(true);

    // type قبلی را پیدا می‌کنیم تا orderش را نگه داریم
    const prevType = delegationTypes.find((t) => t.id === modalState.id);

    const response = await service.current.editDelegationType({
      id: modalState.id,
      name: modalState.value,
      order: prevType?.order ?? 0,
    });

    const updated = response; // 🔹 const برای narrowing پایدار

    if (updated) {
      setDelegationTypes((types) =>
        types.map((t) =>
          t.id === updated.id
            ? { ...t, name: updated.name, order: updated.order }
            : t
        )
      );
    }

    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading(false);
  };

  const deleteDelegationTypes = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const element = removedItems[i];
      await service.current.deleteDelegationType(element.id);
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    await deleteDelegationTypes();
    await createNewDelegationTypes();
    await loadData();
  };

  // 🔹 تغییر مقدار order در state
  const handleOrderChange = (id: string, value: string) => {
    const num = value === "" ? undefined : Number(value);
    setDelegationTypes((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              order: Number.isNaN(num as number) ? undefined : (num as number),
            }
          : t
      )
    );
  };

  // 🔹 روی blur مقدار order را به بک‌اند می‌فرستیم
  const handleOrderBlur = async (delegationType: DelegationType) => {
    if (!delegationType.id) return;
    try {
      await service.current.editDelegationType({
        id: delegationType.id,
        name: delegationType.name,
        order: delegationType.order ?? 0,
      });
      // اگر خواستی بعدش دوباره loadData بزنی:
      // await loadData();
    } catch (err) {
      console.error("Failed to update order", err);
    }
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
      </div>

      <div className="my-5 flex flex-col gap-7 justify-between">
        <div className="">
          {loading ? (
            <Spiner />
          ) : (
            <ul className="flex flex-row flex-wrap gap-2">
              {delegationTypes.map((delegationType, index) => {
                const isRemoved = !!removedItems.find(
                  (item) => item.id === delegationType.id
                );
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-3 items-center rounded-full p-2 shadow-xl ${
                        isRemoved
                          ? "bg-red-100 text-red-800 hover:text-white text-sm hover:bg-red-800"
                          : "bg-[#f6f6f6]/60 text-dark-blue text-sm "
                      } cursor-default transition-all duration-200`}
                    >
                      <span className="font-bold">{delegationType.name}</span>

                      {/* فیلد order برای کنترل ترتیب (سمت بک‌اند) */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-gray-500">ترتیب</span>
                        <input
                          type="number"
                          className="w-16 border rounded px-1 py-0.5 text-xs text-center"
                          value={
                            delegationType.order !== undefined &&
                            delegationType.order !== null
                              ? delegationType.order
                              : ""
                          }
                          onChange={(e) =>
                            handleOrderChange(
                              delegationType.id,
                              e.target.value
                            )
                          }
                          onBlur={() => handleOrderBlur(delegationType)}
                          placeholder="#"
                        />
                      </div>
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
};

export default DelegationTypesList;
