enum FieldType {
  Text = 0,
  Number = 1,
  Select = 2,
  Bool = 3,
  BooleanConditional = 4,
  Image = 5,
  Range = 6,
  SelectiveConditional = 7,
  MultiSelect = 8,
}

enum FieldTypeTitle {
  Text = "متن",
  Number = "عدد",
  Select = "انتخابی",
  Bool = "کلید",
  BooleanConditional = "شرطی کلید",
  Image = "تصویر",
  Range = "بازه",
  SelectiveCondition = "شرطی چندگزینه‌ای",
  MultiSelect = "کلید چندگزینه‌ای",
}

enum FieldInputNecessity {
  Obligatory = 1,
  Optional = 2,
}

enum FieldInputNecessityLabel {
  Obligatory = "اجباری",
  Optional = "اختیاری",
}

enum FieldFilterableStatus {
  IsFilterable,
  IsNotFilterable,
}

enum FieldFilterableStatusLabel {
  IsFilterable = "قابل فیلتر",
  IsNotFilterable = "غیرقابل فیلتر",
}

interface Field {
  id?: string;
  type: FieldType;
  title: string;
  value:
    | string
    | number
    | boolean
    | string[]
    | [number, number]
    | { [key: string]: boolean };
  options?: string[];
  fields?: Field[];
  min?: number;
  max?: number;
  optional?: boolean;
  filterable?: boolean;
  fieldMap?: { [key: string]: Field[] };
  keys?: string[];
}

const defaultField: Field = {
  type: FieldType.Text,
  title: "",
  value: "",
};

export type { Field };
export {
  FieldType,
  FieldTypeTitle,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  defaultField,
};
