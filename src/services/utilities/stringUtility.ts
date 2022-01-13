import {
  Field,
  FieldInputNecessityLabel,
  FieldType,
  FieldTypeTitle,
} from "global/types/Field";

function getFieldTypeAndNecessity(field: Field): string {
  const fieldTypeTitle =
    field.type === FieldType.Text
      ? FieldTypeTitle.Text
      : field.type === FieldType.Number
      ? FieldTypeTitle.Number
      : field.type === FieldType.Select
      ? FieldTypeTitle.Select
      : field.type === FieldType.Bool
      ? FieldTypeTitle.Bool
      : field.type === FieldType.Conditional
      ? FieldTypeTitle.Conditional
      : field.type === FieldType.Image
      ? FieldTypeTitle.Image
      : "---";
  const fieldInputNecessityLabel = !field.optional
    ? FieldInputNecessityLabel.Obligatory
    : FieldInputNecessityLabel.Optional;

  const result = `${fieldTypeTitle} (${fieldInputNecessityLabel})`;

  return result;
}

export { getFieldTypeAndNecessity };
