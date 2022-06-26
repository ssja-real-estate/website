import { EstateForm } from "global/types/EstateForm";
import { Error } from "global/types/Error";
import { FieldType } from "global/types/Field";

const validateForm = (form: EstateForm): Error[] => {
  let errors: Error[] = [];
  let errorMessage: string = "";

  for (let j = 0; j < form.fields.length; j++) {
    const field = form.fields[j];
    if (field.type === FieldType.Range) {
      const range = [field.min ?? 0, field.max ?? 0];
      if (range[0] <= range[1]) continue;

      errorMessage = getRangeErrorMessage(field.title);
    } else if (!field.optional) {
      if (field.type === FieldType.Bool) continue;
      else if (field.type === FieldType.BooleanConditional) {
        if (!field.value) continue;

        for (let k = 0; k < field.fields!.length; k++) {
          const innerField = field.fields![k];
          if (!innerField.optional && innerField.type !== FieldType.Bool) {
            if (!innerField.value) {
              errorMessage = getErrorMessage(innerField.title);
            }
          }
        }
      } else if (!field.value) {
        errorMessage = getErrorMessage(field.title);
      }
    }

    if (!errorMessage) continue;
    errors.push({ message: errorMessage });
  }

  return errors;
};

const getErrorMessage = (fieldTitle: string) => {
  return `فیلد «${fieldTitle}» باید مقدار داشته باشد`;
};

const getRangeErrorMessage = (fieldTitle: string) => {
  return `در فیلد «${fieldTitle}»، مقدار «کمترین» باید بیشتر از مقدار «بیشترین» باشد`;
};

export { validateForm };
