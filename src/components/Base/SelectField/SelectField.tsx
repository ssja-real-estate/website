import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { FieldProps } from "global/componentProps/FieldProps";
import FieldContainer from "../FieldContainer/FieldContainer";

const SelectField = <T extends any>(props: FieldProps<T>) => {
  return (
    <FieldContainer label={props.label} {...props.baseContainerStyle}>
      <Form.Select
        value={props?.value ?? props?.defaultValue}
        onChange={(e) => {
          if (!props.onChangeValue) return;

          const value = e.currentTarget.value as T;
          props.onChangeValue(value);
        }}
      >
        <option
          value={props?.defaultOption?.value ?? ""}
          disabled={props?.defaultOption?.disabled}
        >
          {props?.defaultOption?.label}
        </option>
        {(props?.options ?? []).map((option) => {
          return <option key={uuidv4()}>{option}</option>;
        })}
      </Form.Select>
    </FieldContainer>
  );
};

export default SelectField;
