import { FormGroupProps } from "react-bootstrap";

export interface FieldContainerProps extends FormGroupProps {
  label?: string;
  containerStyle?: string;
  labelStyle?: string;
  div?: boolean;
}
