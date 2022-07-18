import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import { Payment } from "global/types/Payment";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import PaymentService from "services/api/PaymentService/PaymentService";
import { v4 } from "uuid";
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

  return (
    <Modal
      centered
      show={modalState.showBuyCreditModal}
      onHide={() => {
        toggleModalDisplay(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>{Strings.payments}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {payments.map((payment, index) => {
            return (
              <div key={index + v4()}>
                <Form.Check
                  className="m-2"
                  label={`${payment.title} - ${payment.credit} ${Strings.toman}`}
                  name="paymentGroup"
                  type="radio"
                  checked={payment.id === selectedPaymentId}
                  onChange={(event: { target: { value: any } }) => {
                    setSelectedPaymentId(payment.id);
                  }}
                />
                <hr></hr>
              </div>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-3"
          variant="outline-secondary"
          onClick={() => {
            toggleModalDisplay(false);
          }}
        >
          {Strings.cancel}
        </Button>
        <Button className="rounded-3" variant="purple" onClick={buyCredit}>
          {Strings.pay}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyCreditModal;
