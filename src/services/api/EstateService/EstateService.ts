import { defaultEstate, Estate } from "global/types/Estate";
import BaseService from "../BaseService";

class EstateService extends BaseService {
  estateUrl = "/estate";

  async getVerifiedEstates() {
    let verifiedEstates: Estate[] = [];
    try {
      let response = await this.Api.get(
        `${this.estateUrl}/show/all`,
        this.config
      );
      if (response.data) {
        verifiedEstates = response.data as Estate[];
      }
    } catch (error) {
      this.handleError(error);
    }

    return verifiedEstates;
  }

  async getUnverifiedEstates() {
    let unVerifiedEstates: Estate[] = [];
    try {
      let response = await this.Api.get(
        `${this.estateUrl}/show/unverified`,
        this.config
      );
      if (response.data) {
        unVerifiedEstates = response.data as Estate[];
      }
    } catch (error) {
      this.handleError(error);
    }

    return unVerifiedEstates;
  }

  async getEstateById(estateId: string) {
    let estate: Estate = defaultEstate;
    try {
      let response = await this.Api.get(
        `${this.estateUrl}/${estateId}`,
        this.config
      );
      if (response.data) {
        estate = response.data as Estate;
      }
    } catch (error) {
      this.handleError(error);
    }
    return estate;
  }

  async getUserEstates(userId: string) {
    let estates: Estate[] = [];
    try {
      let response = await this.Api.get(
        `${this.estateUrl}/estate/user/${userId}`,
        this.config
      );
      if (response.data) {
        estates = response.data as Estate[];
      }
    } catch (error) {
      this.handleError(error);
    }
    return estates;
  }

  async requestAddEtate(estate: Estate, formData: FormData) {
    formData.append("estate", JSON.stringify(estate));
    let newEstate = undefined;
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

  async verifyEstate(estateId: string) {
    try {
      let response = await this.Api.put(
        `${this.estateUrl}/verify/${estateId}`,
        undefined,
        this.config
      );
      if (response.data) {
        console.log("verify response");
        console.log(response.data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default EstateService;
