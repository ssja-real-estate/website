import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 } from "uuid";
import Strings from "../../../data/strings";
import { globalState } from "../../../global/states/globalStates";
import { Payment } from "../../../global/types/Payment";
import PaymentService from "../../../services/api/PaymentService/PaymentService";
import { profileModalState } from "./ProfileState";

interface Props {
  payments: Payment[];
  reloadScreen?: () => Promise<void>;
}

const BuyCreditModal: React.FC<Props> = ({ payments, reloadScreen }) => {
  const [modalState, setModalState] = useRecoilState(profileModalState);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const state = useRecoilValue(globalState);
  const paymentService = useRef(new PaymentService());
  const mounted = useRef(true);

  useEffect(() => {
    paymentService.current.setToken(state.token);

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const toggleModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showBuyCreditModal: flag,
    });
  };

  const buyCredit = async () => {
    const selectedPayment = payments.find((p) => p.id === selectedPaymentId);
    if (!selectedPayment) return;
    console.log("selected payment id: " + selectedPaymentId);

    // if (!reloadScreen) return;
    // reloadScreen();
  };
  const modalMui = (
    <div className="fixed bg-black/40 inset-0 z-50  flex h-full w-full items-center justify-center">
      <div className="py-2 flex flex-col items-center justify-center  bg-white h-50 rounded-lg gap-4 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
        <div className="font-bold text-xl px-2 border-b w-full py-2">
          {Strings.payments}
        </div>
        <form className="w-full flex flex-col gap-5 justify-center items-center">
          {payments.map((payment, index) => {
            return (
              <div
                className="w-[50%] flex flex-row justify-between select-none"
                key={index + v4()}
              >
                <label className="hover:cursor-pointer" htmlFor={payment.id}>
                  {`${payment.title} - ${payment.credit} ${Strings.toman}`}
                </label>
                <div className="">
                  <input
                    className=""
                    name="paymentGroup"
                    id={payment.id}
                    type="radio"
                    checked={payment.id === selectedPaymentId}
                    onChange={(event: { target: { value: any } }) => {
                      setSelectedPaymentId(payment.id);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </form>
        <div className="flex flex-row items-center justify-end gap-2 px-2 border-t w-full pt-2">
          <button
            onClick={() => {
              toggleModalDisplay(false);
            }}
            className="px-7 py-2 bg-gray-400 text-white rounded-md"
          >
            {Strings.cancel}
          </button>
          <button
            onClick={buyCredit}
            className="px-7 py-2 bg-[#d99221] text-white rounded-md"
          >
            {Strings.save}
          </button>
        </div>
      </div>
    </div>
  );
  return modalState.showBuyCreditModal
    ? ReactDOM.createPortal(modalMui, document.body)
    : null;
};

export default BuyCreditModal;
