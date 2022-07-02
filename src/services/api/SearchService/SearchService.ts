import BaseService from "../BaseService";
import { defaultForm, EstateForm } from "global/types/EstateForm";
import SearchFilter from "global/types/Filter";
import { Estate } from "global/types/Estate";

class SearchService extends BaseService {
  async getfilteredForm(assignmentId: string, estateTypeId: string) {
    let filteredForm: EstateForm = defaultForm;

    try {
      const response = await this.Api.get(
        `filter?assignmentTypeId=${assignmentId}&estateTypeId=${estateTypeId}`,
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

  async searchEstates(filter: SearchFilter) {
    let estates: Estate[] = [];

    try {
      let response = await this.Api.post("/estate/search", filter, this.config);

      console.log("response");
      console.log(response);

      if (response.data) {
        estates = response.data as Estate[];
      }
    } catch (error) {
      this.handleError(error);
    }
    console.log("search estate");
    console.log(estates);

    return estates;
  }
}

export default SearchService;
