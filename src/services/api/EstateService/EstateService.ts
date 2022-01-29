import { EstateForm } from "global/types/EstateForm";
import BaseService from "../BaseService";

class EstateService extends BaseService {
  async requestAddEtate(estate: EstateForm): Promise<void> {
    try {
      console.log(estate);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default EstateService;
