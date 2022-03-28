import { Form } from "react-bootstrap";

import { FieldProps } from "global/componentProps/FieldProps";
import FieldContainer from "../FieldContainer/FieldContainer";

const CheckField: React.FC<FieldProps<boolean>> = (props) => {
  return (
    <FieldContainer label={props.label} {...props.baseContainerStyle}>
      <Form.Check
        className={props.fieldStyle}
        type="switch"
        checked={props?.value}
        onChange={(e) => {
          if (!props.onChangeValue) return;

          const value = e.currentTarget.checked;
          props.onChangeValue(value);
        }}
      />
    </FieldContainer>
  );
};

export default CheckField;
