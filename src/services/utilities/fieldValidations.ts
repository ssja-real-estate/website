import { EstateForm } from "global/types/EstateForm";
import { Error } from "global/types/Error";
import { FieldType } from "global/types/Field";

const validateForm = (form: EstateForm): Error[] => {
  let errors: Error[] = [];
  let errorMessage: string = "";

  for (let i = 0; i < form.sections.length; i++) {
    const section = form.sections[i];
    for (let j = 0; j < section.fields.length; j++) {
      const field = section.fields[j];
      if (!field.optional) {
        if (field.type === FieldType.Bool) continue;
        else if (field.type === FieldType.Conditional) {
          if (!field.value) continue;

          for (let k = 0; k < field.fields!.length; k++) {
            const innerField = field.fields![k];
            if (!innerField.optional && innerField.type !== FieldType.Bool) {
              if (!innerField.value) {
                errorMessage = getErrorMessage(innerField.title);
                if (!!errorMessage) {
                  errors.push({
                    message: errorMessage,
                  });
                }
              }
            }
          }
        } else if (!field.value) {
          errorMessage = getErrorMessage(field.title);
          if (!!errorMessage) {
            errors.push({
              message: errorMessage,
            });
          }
        }
      }
    }
  }

  return errors;
};

const getErrorMessage = (fieldTitle: string) => {
  return `ورودی ${fieldTitle} باید مقدار داشته باشد`;
};

export { validateForm };