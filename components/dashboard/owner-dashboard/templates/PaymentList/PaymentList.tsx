import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalState } from "../../../../../global/states/globalStates";
import { defaultPayment, Payment } from "../../../../../global/types/Payment";
import PaymentService from "../../../../../services/api/PaymentService/PaymentService";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "../../../../EditItemModal/EditItemModalState";
import * as AiIcon from "react-icons/ai";
import * as BiIcon from "react-icons/bi";
import * as MdIcon from "react-icons/md";
import EditItemModal from "../../../../EditItemModal/EditItemModal";
import Strings from "../../../../../data/strings";
import Spiner from "../../../../spinner/Spiner";
import React from "react";
function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [removedItems, setRemovedItems] = useState<Payment[]>([]);
  const [newItems, setNewItems] = useState<Payment[]>([]);
  const [newPayment, setNewPayment] = useState<Payment>(defaultPayment);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new PaymentService());
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
    if (modalState.editMap[EditItemType.Payment]) {
      editPayment();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Payment]]);

  const loadData = async () => {
    setPayments([]);
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllPayments();
    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }
    setPayments(data);
    setLoading((prev) => false);
  };

  const selectItemAsDeleted = (payment: Payment) => {
    setRemovedItems((prev) => {
      const type = prev.find((item) => item.id === payment.id);
      let newRemovedItems = [];
      if (type) {
        newRemovedItems = prev.filter((item) => item.id !== payment.id);
      } else {
        newRemovedItems = [...prev, payment];
      }
      return newRemovedItems;
    });
  };

  const createNewPayments = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const element = newItems[i];
      try {
        await service.current.createPayment(element);
      } catch (error) {
        alert(error);
      }
    }
  };

  const editPayment = async () => {
    if (modalState.id === "") return;

    setLoading((prev) => true);
    let editedPayment =
      (await service.current.editPayment(modalState.id, {
        id: modalState.id,
        title: modalState.title ?? "",
        credit: modalState.credit ?? 0,
        duration: modalState.duration ?? 0,
      })) ?? defaultPayment;

    if (editedPayment) {
      setPayments((payments) => {
        let prevType = payments.find((p) => p.id === editedPayment!.id);
        if (prevType) {
          prevType.title = editedPayment.title;
          prevType.credit = editedPayment.credit;
          prevType.duration = editedPayment.duration;
        }
        return payments;
      });
    }
    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setNewPayment(defaultPayment);
    setLoading((prev) => false);
  };

  const deletePayments = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const element = removedItems[i];
      await service.current.deletePayment(element.id);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deletePayments();
    await createNewPayments();
    await loadData();
  };

  return (
    <div className="h-full flex flex-col">
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.payment}
        editItemType={EditItemType.Payment}
      />
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">
          {Strings.delegationTypes}
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
              {payments.map((payment, index) => {
                return (
                  <React.Fragment key={index}>
                    <li
                      className={`flex flex-row px-2 justify-between gap-5 items-center rounded-full p-2 shadow-xl ${
                        removedItems.length > 0 &&
                        removedItems.find((item) => item.id === payment.id)
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
                      <span className="font-bold">{payment.title}</span>
                      <div className="flex flex-row gap-1">
                        <span
                          onClick={() => {
                            const newMap = buildMap(EditItemType.Payment);
                            setModalState({
                              ...defaultEditItemModalState,
                              id: payment.id,
                              value: payment.title,
                              title: payment.title,
                              credit: payment.credit,
                              duration: payment.duration,
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
                            selectItemAsDeleted(payment);
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
                  {newItem.title}

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
            className="inputDecoration w-[32.5%]"
            placeholder={Strings.newPaymentTitle}
            value={newPayment.title}
            onChange={(e) => {
              setNewPayment({
                ...newPayment,
                title: e.target.value,
              });
            }}
          />
          <input
            type="number"
            className="inputDecoration w-[32.5%]"
            placeholder={Strings.creditAmount}
            value={newPayment.credit === 0 ? undefined : newPayment.credit}
            onChange={(e: { target: { value: any } }) => {
              setNewPayment({
                ...newPayment,
                credit: +e.target.value,
              });
            }}
          />
          <input
            type="number"
            className="inputDecoration w-[32.5%]"
            placeholder={Strings.paymentDuration}
            value={newPayment.duration === 0 ? undefined : newPayment.duration}
            onChange={(e: { target: { value: any } }) => {
              setNewPayment({
                ...newPayment,
                duration: +e.target.value,
              });
            }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center border group border-[#f3bc65] hover:bg-[#f3bc65]"
            onClick={() => {
              if (newPayment.title.trim() !== "") {
                setNewItems((prev) => [
                  ...prev,
                  {
                    ...newPayment,
                    title: newPayment.title.trim(),
                  },
                ]);
                setNewPayment(defaultPayment);
              }
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

export default PaymentList;
