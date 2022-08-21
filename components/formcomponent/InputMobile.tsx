import React, { FC, useState } from "react";

const InputMobile: FC<{
  getVal: (txt: string) => void;
  lable?: string;
  type: string;
  placeholder?: string;
  regex: (txt: string) => { isCheck: boolean; error: string };
}> = (props) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setError] = useState<string>("");
  // props.getVal.get;
  const isValidate = (txt: string) => {
    // alert(222);
    console.log(txt);
    const check = props.regex(txt);
    console.log("check: " + check);

    console.log("reg: " + props.regex(txt));
    if (check.isCheck === true) {
      // alert(check.isCheck);
      setIsValid(true);
      setError("");
    } else {
      // alert(check.isCheck);
      // alert(check.error);
      setIsValid(false);
      setError(check.error);
    }
    // RegexValidator.validatePhon(txt) ? :
    // setIsValid();
  };
  console.log("isValid: " + isValid);
  return (
    <div className=" text-[#2c3e50] space-y-1">
      <label htmlFor="mobileNumber" className="text-[#2c3e50]">
        {props.lable}
      </label>
      <input
        onChange={(e) => props.getVal(e.target.value)}
        onBlur={(e) => isValidate(e.target.value)}
        id="mobileNumber"
        className={`${
          isValid ? "inputDecoration" : "inputErroeDecoration"
        } inputDecoration placeholder:tracking-[.5rem]`}
        type={props.type}
        placeholder="----------"
      />
      <div className="">{isValid}</div>
      <div className="text-red-700 text-sm">{errorMessage}</div>
    </div>
  );
};

export default InputMobile;
