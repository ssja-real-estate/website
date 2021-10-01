enum FieldType {
  Text,
  Number,
  Select,
  Bool,
  Conditional,
  Image,
  Range,
}

enum FieldTypeTitle {
  Text = 'متن',
  Number = 'عدد',
  Select = 'انتخابی',
  Bool = 'کلید',
  Conditional = 'شرطی',
  Image = 'تصویر',
  Range = 'بازه',
}

interface Field {
  name: string;
  type: number;
  title: string;
  value: string | number | boolean | string[] | [number, number];
  options?: string[];
  fields?: Field[];
  min?: number;
  max?: number;
}

export type { Field };
export { FieldType, FieldTypeTitle };
