import { Estate } from "global/types/Estate";
import BaseService from "../BaseService";

class EstateService extends BaseService {
  estateUrl = "/estate";
  async requestAddEtate(estate: Estate, formData: FormData) {
    formData.append("estate", JSON.stringify(estate));
    let newEstate = undefined;
    console.log("request add");
    console.log(estate);

    try {
      let response = await this.Api.post(this.estateUrl, formData, this.config);
      if (response.data) {
        newEstate = response.data as Estate;
      }
    } catch (error) {
      this.handleError(error);
    }
    return newEstate;
  }
}

export default EstateService;
