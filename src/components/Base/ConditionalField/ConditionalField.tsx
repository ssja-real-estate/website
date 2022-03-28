import { FieldProps } from "global/componentProps/FieldProps";
import CheckField from "../CheckField/CheckField";

const ConditionalField: React.FC<FieldProps<boolean>> = (props) => {
  return (
    <>
      <CheckField value={props?.value ?? false} {...props} />
      {props.value && props.children}
    </>
  );
};

export default ConditionalField;
