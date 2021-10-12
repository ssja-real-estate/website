import Unit from 'global/types/Unit';
import { UNIT_URL } from 'local';
import BaseService from '../BaseService';

class UnitService extends BaseService {
  async getAllUnits() {
    let units: Unit[] = [];

    try {
      const response = await this.Api.get(UNIT_URL, this.config);

      if (response.data) {
        response.data.forEach((element: Unit) => {
          units.push(element);
        });
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return units;
  }

  async createUnit(unit: Unit) {
    try {
      await this.Api.post(UNIT_URL, { name: unit.name }, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editUnit(unit: Unit) {
    if (unit.id === '') return;
    let updatedUnit = undefined;
    try {
      const response = await this.Api.put(UNIT_URL, unit, this.config);
      if (response.data) {
        updatedUnit = response.data as Unit;
      }
    } catch (error: any) {
      this.handleError(error);
    }
    return updatedUnit;
  }

  async deleteUnit(id: string) {
    try {
      await this.Api.delete(`${UNIT_URL}/${id}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default UnitService;
