import { ChangeEvent, useState } from "react";
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

const defaultTaxPercent =9;
const defaultMorgageCoefficient = 10000;

const CommissionModal = () => {
  const [modalState, setModalState] = useRecoilState(commissionModalState);
  const [type, setType] = useState<{
    type: PropertyTradeType;
    name: PropertyTradeTypeName;
  }>(defaultType);
  const [price, setPrice] = useState<number>(0);
  const [rentComision, setRentComosion] = useState<number>(25);
  const [mortgage, setMortgage] = useState<string>("");
  const [taxPercent, setTaxPercent] = useState<number>(defaultTaxPercent);
  const [commissionPercent, setCommissionPercent] = useState<number>(
    defaultCommisssionPercent
  );
  const [value, setValue] = useState<string>("");
  const [finalResult, setFinalResult] = useState<string>();
  const [mortgageCoefficient, setMortgageCoefficient] = useState<number>(
    defaultMorgageCoefficient
  );
  const [checkActiveCommissionPercent, setCheckActiveCommissionPercent] =
    useState<boolean>(true);
  const addCommas = (num: string): string => {
    const n = parseInt(num);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const removeNonNumeric = (num: string) =>
    num.toString().replace(/[^0-9]/g, "");

  const handleChange = (e: string) => {
   
    setValue(addCommas(removeNonNumeric(e)));
  };
  const handleChangeMortgage = (e: string) => {
    // const num = parseInt(e);
    console.log(e);

    setMortgage(addCommas(removeNonNumeric(e)));
  };
let quarter=0;
  const calculateCommission = () => {
    let convertedMortgage = convertMortgageToRent();

    let finalPrice = parseInt(value.replaceAll(",", ""));
    if (type.type===PropertyTradeType.RentAndMortgage || type.type===PropertyTradeType.OnlyRent) {
         finalPrice*=rentComision/100;
    }
    if (type.type === PropertyTradeType.OnlyMortgage) {
      finalPrice = convertedMortgage;
    }
    if (type.type===PropertyTradeType.BuyAndSell) {
       quarter = finalPrice * (commissionPercent / 100);
    } else {
       quarter = finalPrice ;
    

    }

     // this line ignoer when PropertyTradeType is RentAndMortage
    if (
      type.type === PropertyTradeType.RentAndMortgage ||
      type.type === PropertyTradeType.OnlyRent
    ) {
      quarter = finalPrice;
    if (type.type===PropertyTradeType.RentAndMortgage) {
      quarter += convertedMortgage;
    }
      
    }
    const tax = quarter * (taxPercent / 100);
    const finalResult = quarter + tax;
    setFinalResult(addCommas(removeNonNumeric(String(finalResult))));
  };

  const convertMortgageToRent = () => {
    const mortgageNumber = mortgage.replaceAll(",", "");
    const mortgageCount = Math.floor(parseInt(mortgageNumber) / 1000000);
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
    setValue("");
    setMortgage("");
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
                    setFinalResult("");
                  }
                }}
              >
                {propertyTradeTypeMap.map((keyValue, index) => {
                  return <option key={index}>{keyValue.name}</option>;
                })}
              </select>
            </div>
            {type.type == PropertyTradeType.BuyAndSell ?
          (
              <>
                <div className="flex flex-col w-full gap-1">
                  <label>{Strings.commissionPercent}:</label>
                  <div className="flex w-full items-center group">
                    <span className="border-r border-t border-b pr-2 h-9 flex items-center group-focus-within:border-[#0ba]">
                      %
                    </span>
                    <input
                      className="inputDecorationDefault w-full border-r-0"
                      type="number"
                      value={commissionPercent}
                      onChange={(e: any) => {
                        setCommissionPercent(e.currentTarget.value);
                      }}
                      //
                    />
                  </div>
                </div>
              </>
            ) : null}
            
            {type.type !== PropertyTradeType.OnlyMortgage ? (
              <>
                <div className="flex flex-col w-full gap-1">
                  <label>
                    {type.type !== PropertyTradeType.RentAndMortgage
                      ? type.type==PropertyTradeType.OnlyRent?Strings.rentPrice: Strings.price
                      : Strings.rentPrice}
                    :
                  </label>
                  <input
                    className="inputDecorationDefault"
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    // onChange={(e: any) => {
                    //   setPrice(+e.currentTarget.value);
                    // }}
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
                    type="text"
                    value={mortgage}
                    onChange={(e: any) => {
                      handleChangeMortgage(e.currentTarget.value);
                    }}
                  />
                </div>
                
               
              </>
            ) : null}
              {type.type == PropertyTradeType.OnlyRent || type.type==PropertyTradeType.RentAndMortgage ?
          (
              <>
                <div className="flex flex-col w-full gap-1">
                  <label>{Strings.rentpersent}:</label>
                  <div className="flex w-full items-center group">
                    <span className="border-r border-t border-b pr-2 h-9 flex items-center group-focus-within:border-[#0ba]">
                      %
                    </span>
                    <input
                      className="inputDecorationDefault w-full border-r-0"
                      type="number"
                      value={rentComision}
                      onChange={(e: any) => {
                        setRentComosion(e.currentTarget.value);
                      }}
                      //
                    />
                  </div>
                </div>
              </>
            ) : null}

            { type.type==PropertyTradeType.OnlyMortgage ||type.type==PropertyTradeType.RentAndMortgage?
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
             </div>:null  
            }
            
           

            <div className="flex flex-col w-full gap-1">
              <label>{Strings.taxPercent}:</label>
              <div className="flex w-full items-center group">
                <span className="border-r border-t border-b pr-2 h-9 flex items-center group-focus-within:border-[#0ba]">
                  %
                </span>
                <input
                  className="inputDecorationDefault w-full border-r-0"
                  type="number"
                  value={taxPercent}
                  onChange={(e: any) => {
                    setTaxPercent(e.currentTarget.value);
                  }}
                />
              </div>
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
              setFinalResult("");
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
