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
  Text = "متن",
  Number = "عدد",
  Select = "انتخابی",
  Bool = "کلید",
  Conditional = "شرطی",
  Image = "تصویر",
  Range = "بازه",
}

interface Field {
  id?: string;
  type: FieldType;
  title: string;
  value: string | number | boolean | string[] | [number, number];
  options?: string[];
  fields?: Field[];
  min?: number;
  max?: number;
}

const defaultField: Field = {
  type: FieldType.Text,
  title: "",
  value: "",
};

const getFieldTitle = (field: Field) => {
  let title = "";

  switch (field.type) {
    case FieldType.Text:
      title = FieldTypeTitle.Text;
      break;
    case FieldType.Number:
      title = FieldTypeTitle.Number;
      break;
    case FieldType.Select:
      title = FieldTypeTitle.Select;
      break;
    case FieldType.Bool:
      title = FieldTypeTitle.Bool;
      break;
    case FieldType.Conditional:
      title = FieldTypeTitle.Conditional;
      break;
    case FieldType.Image:
      title = FieldTypeTitle.Image;
      break;
    case FieldType.Range:
      title = FieldTypeTitle.Range;
      break;
  }

  return title;
};

export type { Field };
export { FieldType, FieldTypeTitle, defaultField, getFieldTitle };
