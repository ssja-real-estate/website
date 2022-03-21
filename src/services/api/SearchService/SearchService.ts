import { Estate } from "global/types/Estate";
import BaseService from "../BaseService";

class SearchService extends BaseService {
  async filterEstates(estate: Estate) {
    let estates: Estate[] = [];

    try {
    } catch (error) {
      this.handleError(error);
    }

    return estates;
  }
}

export default SearchService;
