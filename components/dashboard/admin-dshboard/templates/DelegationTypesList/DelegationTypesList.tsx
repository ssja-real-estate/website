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
    order: 0, // فیلد ترتیب برای آیتم جدید
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

    // اگر خواستی اینجا هم مرتب کنی (در صورتی که بک‌اند مرتب نکرده):
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
      await service.current.createDelegationType({
        name: element.name,
        order: element.order ?? 0,
      } as any);
    }
  };

  const editDelegationType = async () => {
    if (modalState.id === "") return;

    setLoading(true);

    // مقدار order فعلی آیتم
    const prevType = delegationTypes.find((t) => t.id === modalState.id);

    const response = await service.current.editDelegationType({
      id: modalState.id,
      name: modalState.value,
      order: prevType?.order ?? 0,
    } as any);

    const updated = response;

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

  // تغییر order برای آیتم‌های موجود
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

  // ذخیرهٔ order برای آیتم‌های موجود (روی blur)
  const handleOrderBlur = async (delegationType: DelegationType) => {
    if (!delegationType.id) return;
    try {
      await service.current.editDelegationType({
        id: delegationType.id,
        name: delegationType.name,
        order: delegationType.order ?? 0,
      } as any);
      // اگر خواستی بعد از هر تغییر دوباره از سرور بخونی:
      // await loadData();
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  // مدیریت ورود نام و order برای آیتم جدید
  const handleNewNameChange = (value: string) => {
    setNewDelegationType((prev) => ({ ...prev, name: value }));
  };

  const handleNewOrderChange = (value: string) => {
    const num = value === "" ? 0 : Number(value);
    setNewDelegationType((prev) => ({
      ...prev,
      order: Number.isNaN(num) ? 0 : num,
    }));
  };

  const handleAddNewItem = () => {
    if (!newDelegationType.name.trim()) return;

    const item: DelegationType = {
      id: "", // بک‌اند id را می‌سازد
      name: newDelegationType.name.trim(),
      order: newDelegationType.order ?? 0,
    };

    setNewItems((prev) => [...prev, item]);

    // می‌توانی هم‌زمان در لیست فعلی نشان بدهی (اختیاری):
    setDelegationTypes((prev) => [...prev, item]);

    // ریست فرم
    setNewDelegationType({
      id: "",
      name: "",
      order: 0,
    });
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
        {/* لیست آیتم‌ها */}
        <div>
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

                      {/* فیلد order برای آیتم‌های موجود */}
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

        {/* بخش افزودن آیتم جدید با name + order */}
        <div className="mt-4 border-t pt-4">
          <h5 className="text-sm font-semibold text-dark-blue mb-2">
            افزودن نوع درخواست جدید
          </h5>
          <div className="flex flex-row flex-wrap items-center gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1 text-sm min-w-[180px]"
              placeholder={Strings.delegationType}
              value={newDelegationType.name}
              onChange={(e) => handleNewNameChange(e.target.value)}
            />
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-500">ترتیب</span>
              <input
                type="number"
                className="w-16 border rounded px-1 py-0.5 text-xs text-center"
                value={
                  newDelegationType.order !== undefined &&
                  newDelegationType.order !== null
                    ? newDelegationType.order
                    : ""
                }
                onChange={(e) => handleNewOrderChange(e.target.value)}
                placeholder="#"
              />
            </div>
            <button
              onClick={handleAddNewItem}
              className="bg-dark-blue text-white text-sm px-3 py-1 rounded hover:bg-blue-900 transition-all"
            >
              افزودن
            </button>
          </div>

          {/* اگر بخواهی یکجا ذخیره کنی */}
          {newItems.length > 0 && (
            <div className="mt-3">
              <button
                onClick={saveChanges}
                className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition-all"
              >
                ذخیره تغییرات جدید
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DelegationTypesList;
