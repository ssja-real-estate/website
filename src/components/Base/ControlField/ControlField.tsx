import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

import { FieldProps } from "global/componentProps/FieldProps";
import FieldContainer from "../FieldContainer/FieldContainer";

const ControlField = <T extends any>(props: FieldProps<T>) => {
  return (
    <FieldContainer label={props.label} {...props.baseContainerStyle}>
      <Form.Control
        className={props.fieldStyle}
        type={props.type}
        value={props?.value ?? props?.defaultValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (!props.onChangeValue) return;

          const value = e.currentTarget.value as T;
          props.onChangeValue(value);
        }}
      />
    </FieldContainer>
  );
};

export default ControlField;
