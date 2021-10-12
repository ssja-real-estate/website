import EstateType from 'global/types/EstateType';
import { ESTATE_TYPE_URL } from 'local';
import BaseService from '../BaseService';

class EstateTypeService extends BaseService {
  async getAllEstateTypes() {
    let estateTypes: EstateType[] = [];
    try {
      const response = await this.Api.get(ESTATE_TYPE_URL, this.config);
      if (response.data) {
        response.data.forEach((element: EstateType) => {
          estateTypes.push(element);
        });
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return estateTypes;
  }

  async createEstateType(estateType: EstateType) {
    try {
      await this.Api.post(
        ESTATE_TYPE_URL,
        { name: estateType.name },
        this.config
      );
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editEstateType(estateType: EstateType) {
    if (estateType.id === '') return;

    let type = undefined;

    try {
      const response = await this.Api.put(
        ESTATE_TYPE_URL,
        estateType,
        this.config
      );

      if (response.data) {
        type = response.data as EstateType;
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return type;
  }

  async deleteEstateType(id: string) {
    try {
      await this.Api.delete(`${ESTATE_TYPE_URL}/${id}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default EstateTypeService;
