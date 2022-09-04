import React, { FC } from "react";

interface LabelSelectBox {
  htmlForLabler?: string;
  titleLabel?: string;
  labelColor?: string;
}
interface OptionSelectBox {
  id: string;
  name: string;
}

const Select: FC<{
  options: OptionSelectBox[];
  label?: LabelSelectBox;
  defaultValue?: string;
  onChange: Function;
  value?: string;
}> = (props) => {
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

        // value={props.value}
      >
        <option className="accent-gray-900 py-2">انتخاب کنید</option>
        {props.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
