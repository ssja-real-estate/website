export type InputFieldType = "text" | "number" | "file";

export interface FieldProps<T> {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  type?: InputFieldType;
  value?: any;
  defaultValue?: any;
  multiple?: boolean;
  options?: string[];
  range?: [number, number];
  defaultOption?: {
    label?: string;
    value?: string;
    disabled?: boolean;
  };
  baseContainerStyle?: {
    containerStyle?: string;
    labelStyle?: string;
  };
  fieldStyle?: string;
  minFieldStyle?: string;
  maxFieldStyle?: string;
  onChangeValue?: (value: T) => void;
}
