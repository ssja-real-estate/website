import { AxiosResponse } from "axios";
import { defaultForm, EstateForm } from "../../../global/types/EstateForm";
import { FieldType } from "../../../global/types/Field";
import BaseService from "../BaseService";

class FormService extends BaseService {
  private formUrl = "/form";

  getForms = async () => {
    let forms: EstateForm[] = [];

    try {
      const response: AxiosResponse<any> = await this.Api.get(
        this.formUrl,
        this.config
      );
      if (response.data) {
        forms = response.data as EstateForm[];
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return forms;
  };

  getForm = async (
    assignmentTypeId: string,
    estateTypeId: string
  ): Promise<EstateForm> => {
    let form: EstateForm = defaultForm;
    try {
      const response = await this.Api.get("/form", {
        ...this.config,
        params: {
          assignmentTypeId,
          estateTypeId,
        },
      });
      if (response.data) {
        form = response.data as EstateForm;
        for (let i = 0; i < form.fields.length; i++) {
          const field = form.fields[i];
          if (field.type === FieldType.MultiSelect) {
            if (!field.value) field.value = {};
            const fieldValue = field.value as { [key: string]: boolean };
            (field.keys ?? []).forEach((key) => {
              if (!fieldValue[key]) fieldValue[key] = false;
            });
            field.value = { ...fieldValue };
          }
        }
      }
    } catch (error: any) {
      this.handleError(error);
    }

   
    return form;
  };

  createForm = async (form: EstateForm) => {
    try {
      await this.Api.post(this.formUrl, form, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  };

  updateForm = async (formId: string, form: EstateForm) => {
    try {
      await this.Api.put(`${this.formUrl}/${formId}`, form, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  };

  deleteForm = async (formId: string) => {
    try {
      await this.Api.delete(`${this.formUrl}/${formId}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  };
}

export default FormService;
