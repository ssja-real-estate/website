import { FC } from "react";

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
        onChange={(e) => console.log(e.target.value)}
        className=""
        id={props.label?.htmlForLabler}
        defaultValue="2"
      >
        <option disabled className="accent-gray-900 py-2" value="2">
          انتخاب کنید
        </option>
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
