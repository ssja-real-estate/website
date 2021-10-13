enum FieldType {
  Text = 0,
  Number = 1,
  Select = 2,
  Bool = 3,
  Conditional = 4,
  Image = 5,
  Range = 6,
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
  id: string;
  type: FieldType;
  title: string;
  value: string | number | boolean | string[] | [number, number];
  options?: string[];
  fields?: Field[];
  min?: number;
  max?: number;
}

export type { Field };
export { FieldType, FieldTypeTitle };
