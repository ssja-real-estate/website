import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import { defaultPayment, Payment } from "global/types/Payment";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import PaymentService from "services/api/PaymentService/PaymentService";
import ListItem from "../../../../../../components/ListItem/ListItem";
import "./PaymentList.css";

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
      await service.current.createPayment(element);
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
    <>
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.payment}
        editItemType={EditItemType.Payment}
      />
      <h4 className="mt-4 ms-3 d-inline">{Strings.payments}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          await loadData();
        }}
      >
        <i className="refresh-icon bi-arrow-counterclockwise"></i>
      </Button>
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
            <Button
              variant="dark"
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
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="number"
              placeholder={Strings.paymentDuration}
              value={
                newPayment.duration === 0 ? undefined : newPayment.duration
              }
              onChange={(e: { target: { value: any } }) => {
                setNewPayment({
                  ...newPayment,
                  duration: +e.target.value,
                });
              }}
            />
            <Form.Control
              type="number"
              placeholder={Strings.creditAmount}
              value={newPayment.credit === 0 ? undefined : newPayment.credit}
              onChange={(e: { target: { value: any } }) => {
                setNewPayment({
                  ...newPayment,
                  credit: +e.target.value,
                });
              }}
            />
            <Form.Control
              type="text"
              placeholder={Strings.newPaymentTitle}
              value={newPayment.title}
              onChange={(e: { target: { value: any } }) => {
                setNewPayment({
                  ...newPayment,
                  title: e.target.value,
                });
              }}
            />
          </InputGroup>
        </Col>
        <Col sm={"auto"}>
          <Button
            variant="purple"
            className="my-4"
            onClick={async () => {
              await saveChanges();
              setNewItems([]);
              setRemovedItems([]);
              setNewPayment(defaultPayment);
            }}
          >
            {Strings.saveChanges}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading ? (
            <Spinner animation="border" variant="primary" className="my-5" />
          ) : (
            <ListGroup>
              {payments.map((payment, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={payment.title}
                      onRemove={() => {
                        selectItemAsDeleted(payment);
                      }}
                      onEdit={() => {
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
                    />
                  </React.Fragment>
                );
              })}
            </ListGroup>
          )}
        </Col>
        <Col>
          <ListGroup>
            {newItems.map((newItem, index) => {
              return (
                <ListGroup.Item
                  key={index}
                  variant="warning"
                  action
                  className="new-item d-flex flex-row justify-content-between align-items-center"
                >
                  {newItem.title}
                  <i
                    className="bi-x-lg remove-icon"
                    onClick={() => {
                      setNewItems((prev) =>
                        prev.filter((_, id) => id !== index)
                      );
                    }}
                  ></i>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default PaymentList;
