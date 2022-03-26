import BaseService from "../BaseService";
import { defaultForm, EstateForm } from "global/types/EstateForm";

class SearchService extends BaseService {
  async getfilteredForm(assignmentId: string, estateTypeId: string) {
    let filteredForm: EstateForm = defaultForm;

    try {
      const response = await this.Api.get(
        `filterform/${assignmentId}/${estateTypeId}`,
        this.config
      );

      if (response.data) {
        filteredForm = response.data as EstateForm;
      }
    } catch (error) {
      this.handleError(error);
    }

    return filteredForm;
  }
}

export default SearchService;
