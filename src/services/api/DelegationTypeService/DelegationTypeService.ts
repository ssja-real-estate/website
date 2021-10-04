import Strings from 'global/constants/strings';
import DelegationType from 'global/types/DelegationType';
import ModelUtility from 'global/types/ModelUtility';
import toast from 'react-hot-toast';
import BaseService from '../BaseService';

class DelegationTypeService extends BaseService {
  private getDelegationTypeUrl = '/assignmenttypes';
  private changeDelegationTypeUrl = '/assignmenttype';

  async getAllDelegationTypes(): Promise<DelegationType[]> {
    let delegationTypes: DelegationType[] = [];

    try {
      var data = await this.Api.get(this.getDelegationTypeUrl, this.config);

      data.data.forEach((element: any) => {
        let delegation = ModelUtility.convertToDelegationType(element);
        delegationTypes.push(delegation);
      });
    } catch (error) {
      toast.error(Strings.errorFetchData);
    }

    return delegationTypes;
  }

  async createDelegationType(delegationType: DelegationType) {
    try {
      const result = await this.Api.post(
        this.changeDelegationTypeUrl,
        {
          name: delegationType.name,
        },
        this.config
      );
      console.log(result);
    } catch (error) {
      toast.error(Strings.errorFetchData);
      console.log(error);
    }
  }
}

export default DelegationTypeService;
