import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

import { FieldProps } from "global/componentProps/FieldProps";
import FieldContainer from "../FieldContainer/FieldContainer";

const ImageField = (props: FieldProps<File[]>) => {
  return (
    <FieldContainer label={props.label} {...props.baseContainerStyle}>
      <Form.Control
        type="file"
        multiple={props.multiple}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (!props.onChangeValue) return;

          const value = Array.from(e.currentTarget?.files ?? []);
          props.onChangeValue(value);
        }}
      />
    </FieldContainer>
  );
};

export default ImageField;
