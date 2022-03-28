import { FieldProps } from "global/componentProps/FieldProps";
import ControlField from "../ControlField/ControlField";
import FieldContainer from "../FieldContainer/FieldContainer";

const RangeField = (props: FieldProps<number>) => {
  return (
    <FieldContainer label={props.label} div {...props.baseContainerStyle}>
      <ControlField
        type={"number"}
        value={props.range ? props.range[0] : ""}
        label={props.minLabel}
        fieldStyle={props.minFieldStyle}
        onChangeValue={props.onChangeValue}
      />
      <ControlField
        type={"number"}
        value={props.range ? props.range[1] : ""}
        label={props.maxLabel}
        fieldStyle={props.maxFieldStyle}
        onChangeValue={props.onChangeValue}
      />
    </FieldContainer>
  );
};

export default RangeField;
