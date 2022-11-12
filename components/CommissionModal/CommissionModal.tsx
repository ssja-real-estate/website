import { useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../data/strings";
import CustomModal from "../modal/CustomModal";
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
    <CustomModal show={modalState.showCommissionModal}>
      <div className="px-4 py-2">
        <div>
          <div className="text-center font-bold">
            {Strings.commissionCalculation}
          </div>
        </div>
        <div>
          <form className="space-y-3">
            <div className="flex flex-col w-full gap-1">
              <label>{Strings.tradeType}:</label>
              <select
                className="defaultSelectbox"
                value={type.name}
                onChange={(e: { currentTarget: { value: any } }) => {
                  const value = e.currentTarget.value;
                  const item = propertyTradeTypeMap.find(
                    (kv) => kv.name === value
                  );
                  if (item) {
                    resetValues();
                    setType(item);
                    setFinalResult(0);
                  }
                }}
              >
                {propertyTradeTypeMap.map((keyValue, index) => {
                  return <option key={index}>{keyValue.name}</option>;
                })}
              </select>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label>{Strings.commissionPercent}:</label>
              <input
                className="inputDecorationDefault"
                type="number"
                value={commissionPercent}
                onChange={(e: any) => {
                  setCommissionPercent(e.currentTarget.value);
                }}
              />
            </div>
            {type.type !== PropertyTradeType.OnlyMortgage ? (
              <>
                <div className="flex flex-col w-full gap-1">
                  <label>
                    {type.type !== PropertyTradeType.RentAndMortgage
                      ? Strings.price
                      : Strings.rentPrice}
                    :
                  </label>
                  <input
                    className="inputDecorationDefault"
                    type="number"
                    value={price}
                    onChange={(e: any) => {
                      setPrice(+e.currentTarget.value);
                    }}
                  />
                </div>
              </>
            ) : null}
            {type.type === PropertyTradeType.RentAndMortgage ||
            type.type === PropertyTradeType.OnlyMortgage ? (
              <>
                <div className="flex flex-col w-full gap-1">
                  <label>{Strings.mortgagePrice}:</label>
                  <input
                    className="inputDecorationDefault"
                    type="number"
                    value={mortgage}
                    onChange={(e: any) => {
                      setMortgage(e.currentTarget.value);
                    }}
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label>{Strings.mortgageCoefficient}</label>
                  <input
                    className="inputDecorationDefault"
                    type="number"
                    value={mortgageCoefficient}
                    onChange={(e: any) => {
                      setMortgageCoefficient(e.currentTarget.value);
                    }}
                  />
                </div>
              </>
            ) : null}
            <div className="flex flex-col w-full gap-1">
              <label>{Strings.taxPercent}:</label>
              <input
                className="inputDecorationDefault"
                type="number"
                value={taxPercent}
                onChange={(e: any) => {
                  setTaxPercent(e.currentTarget.value);
                }}
              />
            </div>
          </form>
          {!finalResult ? null : (
            <h5 className="my-2 bg-green-300 p-2">{`${Strings.commission} : ${finalResult} ${Strings.toman}`}</h5>
          )}
        </div>
        <div className="flex flex-row justify-end gap-2 mt-4">
          <button
            className="bg-gray-300 p-2 rounded-xl w-32 hover:bg-gray-200 transition-all text-sm"
            // variant="outline-secondary"
            onClick={() => {
              toggleModalDisplay(false);
              resetValues();
              setFinalResult(0);
            }}
          >
            {Strings.cancel}
          </button>
          <button
            className="bg-[#f3bc65] p-2 rounded-xl hover:bg-[#f3bc65]/70 transition-all text-sm w-32"
            // variant="purple"
            onClick={calculateCommission}
          >
            {Strings.commissionCalculation}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default CommissionModal;
