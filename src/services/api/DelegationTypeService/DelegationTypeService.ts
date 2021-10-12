import DelegationType from 'global/types/DelegationType';
import { DELEGATION_TYPE_URL } from 'local';
import BaseService from '../BaseService';

class DelegationTypeService extends BaseService {
  async getAllDelegationTypes(): Promise<DelegationType[]> {
    let delegationTypes: DelegationType[] = [];

    try {
      var data = await this.Api.get(DELEGATION_TYPE_URL, this.config);

      if (!data.data) return delegationTypes;
      data.data.forEach((element: any) => {
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
        DELEGATION_TYPE_URL,
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
    if (delegationType.id === '') return;
    let newDelegationType = undefined;
    try {
      const response = await this.Api.put(
        DELEGATION_TYPE_URL,
        delegationType,
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
      await this.Api.delete(`${DELEGATION_TYPE_URL}/${id}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default DelegationTypeService;
