import React, { FC, useEffect, useState } from "react";

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
  onChange: Function;
  value?: string;
  isDisabled?: boolean;
}> = (props) => {
  const [optionsSet, setOptions] = useState<OptionSelectBox[]>();
  // const [isState, setIsstate] = useState(true);
  useEffect(() => {
    setOptions(props.options);
  }, [optionsSet, props.options]);
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
          console.log(e.target.value);

          props.onChange(e.target.value);
        }}
        className=""
        id={props.label?.htmlForLabler}
        value={props.value}
        defaultValue="choose"
      >
        <option
          value="choose"
          className="accent-gray-900 py-2"
          disabled={props.isDisabled}
        >
          انتخاب کنید
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
