import { EstateForm } from "global/types/EstateForm";
import { Error } from "global/types/Error";
import { FieldType } from "global/types/Field";

const validateForm = (form: EstateForm): Error[] => {
  let errors: Error[] = [];

  form.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!field.optional) {
        if (!field.value) {
          let errorMessage = getErrorMessage(
            section.title,
            field.title,
            field.type
          );
          if (!!errorMessage) {
            errors.push({
              message: errorMessage,
            });
          }
        }
      }
    });
  });
  return errors;
};

// const validateField = (
//   sectionTitle: string,
//   field: Field
// ): Error | undefined => {
//   let error = undefined;

//   switch (field.type) {
//     case FieldType.Select:
//       if (!field.options!.includes(field.value as string)) {
//         error = {
//           message: getErrorMessage(sectionTitle, field.title, field.type),
//         } as Error;
//       }
//       break;
//   }

//   return error;
// };

const getErrorMessage = (
  sectionTitle: string,
  fieldTitle: string,
  fieldType: FieldType
) => {
  switch (fieldType) {
    case FieldType.Select:
      return `ورودی ${fieldTitle} در بخش ${sectionTitle} باید مقدار داشته باشد`;
  }
  return undefined;
};

export { validateForm };
