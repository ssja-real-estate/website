import Strings from "global/constants/strings";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useRecoilState } from "recoil";
import commissionModalState from "./CommissionModalState";

enum PropertyTradeType {
  BuyAndSell = 0,
  RentAndMortgage = 1,
  OnlyRent = 2,
  OnlyMortgage = 3,
}

enum PropertyTradeTypeName {
  BuyAndSell = "خرید و فروش",
  RentAndMortgage = "رهن و اجاره",
  OnlyRent = "اجاره کامل",
  OnlyMortgage = "رهن کامل",
}

const propertyTradeTypeMap = [
  {
    type: PropertyTradeType.BuyAndSell,
    name: PropertyTradeTypeName.BuyAndSell,
  },
  {
    type: PropertyTradeType.RentAndMortgage,
    name: PropertyTradeTypeName.RentAndMortgage,
  },
  {
    type: PropertyTradeType.OnlyRent,
    name: PropertyTradeTypeName.OnlyRent,
  },
  {
    type: PropertyTradeType.OnlyMortgage,
    name: PropertyTradeTypeName.OnlyMortgage,
  },
];

const defaultType = {
  type: PropertyTradeType.BuyAndSell,
  name: PropertyTradeTypeName.BuyAndSell,
};
const defaultCommisssionPercent = 0.75;
const defaultTaxPercent = 9;
const defaultMorgageCoefficient = 10000;

const CommissionModal = () => {
  const [modalState, setModalState] = useRecoilState(commissionModalState);
  const [type, setType] = useState<{
    type: PropertyTradeType;
    name: PropertyTradeTypeName;
  }>(defaultType);
  const [price, setPrice] = useState<number>(0);
  const [mortgage, setMortgage] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(defaultTaxPercent);
  const [commissionPercent, setCommissionPercent] = useState<number>(
    defaultCommisssionPercent
  );
  const [finalResult, setFinalResult] = useState<number>(0);
  const [mortgageCoefficient, setMortgageCoefficient] = useState<number>(
    defaultMorgageCoefficient
  );

  const calculateCommission = () => {
    let convertedMortgage = convertMortgageToRent();
    let finalPrice = price;
    if (type.type === PropertyTradeType.OnlyMortgage) {
      finalPrice = convertedMortgage;
    }
    let quarter = finalPrice * (commissionPercent / 100);
    if (type.type === PropertyTradeType.RentAndMortgage) {
      quarter += convertedMortgage;
    }
    const tax = quarter * (taxPercent / 100);
    const finalResult = quarter + tax;
    setFinalResult(finalResult);
  };

  const convertMortgageToRent = () => {
    const mortgageCount = Math.floor(mortgage / 1000000);
    return mortgageCount * mortgageCoefficient;
  };

  const toggleModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showCommissionModal: flag,
    });
  };

  const resetValues = () => {
    setType(defaultType);
    setPrice(0);
    setMortgage(0);
    setCommissionPercent(defaultCommisssionPercent);
    setMortgageCoefficient(defaultMorgageCoefficient);
    setTaxPercent(defaultTaxPercent);
  };

  return (
    <Modal
      centered
      show={modalState.showCommissionModal}
      onHide={() => {
        toggleModalDisplay(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>{Strings.commissionCalculation}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="fgTradeType">
            <Form.Label>{Strings.tradeType}</Form.Label>
            <Form.Select
              value={type.name}
              onChange={(e: { currentTarget: { value: any } }) => {
                const value = e.currentTarget.value;
                const item = propertyTradeTypeMap.find(
                  (kv) => kv.name === value
                );
                if (item) {
                  resetValues();
                  setType(item);
                }
              }}
            >
              {propertyTradeTypeMap.map((keyValue, index) => {
                return <option key={index}>{keyValue.name}</option>;
              })}
            </Form.Select>
          </Form.Group>
          <br></br>
          <Form.Group className="mt-2" controlId="fgCommission">
            <Form.Label>{Strings.commissionPercent}</Form.Label>
            <Form.Control
              type="number"
              value={commissionPercent}
              onChange={(e: any) => {
                setCommissionPercent(e.currentTarget.value);
              }}
            />
          </Form.Group>
          <br></br>
          {type.type !== PropertyTradeType.OnlyMortgage ? (
            <>
              <Form.Group className="mt-2" controlId="fgPrice">
                <Form.Label>
                  {type.type !== PropertyTradeType.RentAndMortgage
                    ? Strings.price
                    : Strings.rentPrice}
                </Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e: any) => {
                    setPrice(+e.currentTarget.value);
                  }}
                />
              </Form.Group>
              <br></br>
            </>
          ) : null}
          {type.type === PropertyTradeType.RentAndMortgage ||
          type.type === PropertyTradeType.OnlyMortgage ? (
            <>
              <Form.Group className="mt-2" controlId="fgMortgage">
                <Form.Label>{Strings.mortgagePrice}</Form.Label>
                <Form.Control
                  type="number"
                  value={mortgage}
                  onChange={(e: any) => {
                    setMortgage(e.currentTarget.value);
                  }}
                />
              </Form.Group>
              <br></br>
              <Form.Group className="mt-2" controlId="fgMortgage">
                <Form.Label>{Strings.mortgageCoefficient}</Form.Label>
                <Form.Control
                  type="number"
                  value={mortgageCoefficient}
                  onChange={(e: any) => {
                    setMortgageCoefficient(e.currentTarget.value);
                  }}
                />
              </Form.Group>
              <br></br>
            </>
          ) : null}
          <Form.Group className="mt-2" controlId="fgTaxPercent">
            <Form.Label>{Strings.taxPercent}</Form.Label>
            <Form.Control
              type="number"
              value={taxPercent}
              onChange={(e: any) => {
                setTaxPercent(e.currentTarget.value);
              }}
            />
          </Form.Group>
        </Form>
        {!finalResult ? null : (
          <h5 className="mt-4">{`${Strings.commission} : ${finalResult} ${Strings.toman}`}</h5>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-3"
          variant="outline-secondary"
          onClick={() => {
            toggleModalDisplay(false);
            resetValues();
          }}
        >
          {Strings.cancel}
        </Button>
        <Button
          className="rounded-3"
          variant="purple"
          onClick={calculateCommission}
        >
          {Strings.commissionCalculation}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommissionModal;
