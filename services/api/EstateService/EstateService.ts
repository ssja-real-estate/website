import axios, { AxiosResponse } from "axios";
import {
  defaultEstate,
  Estate,
  EstateStatus,
} from "../../../global/types/Estate";
import BaseService from "../BaseService";

class EstateService extends BaseService {
  estateUrl = "/estate";
  estatesUrl = "/estates"; //for home
  async getEstates(status: EstateStatus = EstateStatus.Verified) {
    let verifiedEstates: Estate[] = [];
    try {
      let response = await this.Api.get(
        `${this.estateUrl}/list/${status}`,
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

  async getLastEstates(status: EstateStatus = EstateStatus.Verified) {
    let verifiedEstates: Estate[] = [];
    try {
      let response = await axios
        .create({
          baseURL: `https://ssja.ir/api/`,
          timeout: 10000,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .get(`${this.estatesUrl}`);
      if (response.data) {
        console.log(response);

        verifiedEstates = response.data as Estate[];
      }
    } catch (error) {
      this.handleError(error);
    }
    return verifiedEstates;
  }

  async getEstateById(estateId: string) {
    let estate: Estate = defaultEstate;
    try {
      let response: AxiosResponse<any> = await this.Api.get(
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

  async getUserEstates() {
    let estates: Estate[] = [];
    try {
      let response = await this.Api.get(
        `${this.estateUrl}/list/user`,
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

  async requestAddEtate(formData: FormData) {
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

  async editEstate(estateId: string, formData: FormData) {
    let editedEstate = undefined;
    try {
      await this.Api.put(
        `${this.estateUrl}/${estateId}`,
        formData,
        this.config
      );
    } catch (error) {
      this.handleError(error);
    }
    return editedEstate;
  }

  async updateEstateStatus(
    estateId: string,
    status: EstateStatus,
    description: string = ""
  ) {
    try {
      await this.Api.put(
        `${this.estateUrl}/status/${estateId}`,
        {
          status,
          description,
        },
        this.config
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default EstateService;
