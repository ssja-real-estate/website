import React, { FC, useEffect, useState } from "react";
import Strings from "../../data/strings";

export interface LabelSelectBox {
  htmlForLabler?: string;
  titleLabel?: string;
  labelColor?: string;
}
export interface OptionSelectBox {
  id: string;
  name: string;
}

const Select: FC<{
  options: OptionSelectBox[];
  label?: LabelSelectBox;
  defaultValue?: string;
  onChange: Function | null;
  value?: string;
  isDisabled?: boolean;
}> = (props) => {
  const [optionsSet, setOptions] = useState<OptionSelectBox[]>();
  // const [isState, setIsstate] = useState(true);
  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  return (
    <>
      {props.label && (
        <label
          className={`text-${props.label?.labelColor}`}
          htmlFor={props.label?.htmlForLabler}
        >
          {props.label?.titleLabel}
        </label>
      )}
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          props.onChange !== null ? props.onChange(e.target.value) : null;
        }}
        className=""
        id={props.label?.htmlForLabler}
        value={props.value}
        disabled={props?.isDisabled ? true : false}
        // defaultValue=""
      >
        <option value="" className="accent-gray-900 py-2" disabled>
          {Strings.choose}
        </option>
        {optionsSet?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
