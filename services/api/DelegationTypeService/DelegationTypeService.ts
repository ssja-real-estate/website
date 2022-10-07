import { AxiosResponse } from "axios";
import DelegationType from "../../../global/types/DelegationType";
import BaseService from "../BaseService";

class DelegationTypeService extends BaseService {
  private delegationTypeUrl = "/assignmenttype";

  async getAllDelegationTypes(): Promise<DelegationType[]> {
    let delegationTypes: DelegationType[] = [];

    try {
      var response: AxiosResponse<any> = await this.Api.get(
        this.delegationTypeUrl,
        this.config
      );

      if (!response.data) return delegationTypes;

      response.data.forEach((element: any) => {
        let delegation = element;
        delegationTypes.push(delegation);
      });
    } catch (error: any) {
      this.handleError(error);
    }

    return delegationTypes;
  }

  async createDelegationType(delegationType: DelegationType) {
    try {
      await this.Api.post(
        this.delegationTypeUrl,
        {
          name: delegationType.name,
        },
        this.config
      );
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editDelegationType(delegationType: DelegationType) {
    if (delegationType.id === "") return;
    let newDelegationType = undefined;
    try {
      const response = await this.Api.put(
        `${this.delegationTypeUrl}/${delegationType.id}`,
        {
          name: delegationType.name,
        },
        this.config
      );

      if (response.data) {
        newDelegationType = response.data as DelegationType;
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return newDelegationType;
  }

  async deleteDelegationType(id: string) {
    try {
      await this.Api.delete(`${this.delegationTypeUrl}/${id}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default DelegationTypeService;
