import BaseService from "../BaseService";

class DocumentService extends BaseService {
  documentUrl="/document"
  createForm = async (form: FormData) => {
    try {
     let response= await this.Api.post(this.documentUrl, form, this.config);
     if (response.status==200) {
      return true;
     }

    } catch (error: any) {
      this.handleError(error);
    }
  };
}
export default DocumentService