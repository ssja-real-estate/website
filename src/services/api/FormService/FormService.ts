import { EstateForm } from 'global/types/EstateForm';
import { FORM_URL } from 'local';
import BaseService from '../BaseService';

class FormService extends BaseService {
  getForms = async () => {
    let forms: EstateForm[] = [];

    try {
      const response = await this.Api.get(FORM_URL, this.config);
      if (response.data) {
        forms = response.data as EstateForm[];
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return forms;
  };

  getForm = async () => {};

  createForm = async (form: EstateForm) => {
    try {
      await this.Api.post(FORM_URL, form, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  };

  updateForm = async (formId: string, form: EstateForm) => {
    try {
      await this.Api.put(`${FORM_URL}/${formId}`, form, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  };

  deleteForm = async (formId: string) => {
    try {
      await this.Api.delete(`${FORM_URL}/${formId}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  };
}
