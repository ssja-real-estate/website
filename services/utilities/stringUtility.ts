import {
  Field,
  FieldFilterableStatusLabel,
  FieldInputNecessityLabel,
  FieldType,
  FieldTypeTitle,
} from "../../global/types/Field";

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
      : field.type === FieldType.BooleanConditional
      ? FieldTypeTitle.BooleanConditional
      : field.type === FieldType.Image
      ? FieldTypeTitle.Image
      : field.type === FieldType.SelectiveConditional
      ? FieldTypeTitle.SelectiveCondition
      : field.type === FieldType.MultiSelect
      ? FieldTypeTitle.MultiSelect
      : "---";
  const fieldInputNecessityLabel = !field.optional
    ? FieldInputNecessityLabel.Obligatory
    : FieldInputNecessityLabel.Optional;

  const filterableFieldLabel = field.filterable
    ? FieldFilterableStatusLabel.IsFilterable
    : FieldFilterableStatusLabel.IsNotFilterable;

  const result = `${fieldTypeTitle} (${filterableFieldLabel} - ${fieldInputNecessityLabel})`;

  return result;
}

export { getFieldTypeAndNecessity };
