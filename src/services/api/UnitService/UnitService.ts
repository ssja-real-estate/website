import Unit from 'global/types/Unit';
import BaseService from '../BaseService';

class UnitService extends BaseService {
  private unitUrl = process.env.REACT_APP_UNIT_URL ?? '';

  async getAllUnits() {
    let units: Unit[] = [];

    try {
      const response = await this.Api.get(this.unitUrl, this.config);

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
      await this.Api.post(this.unitUrl, { name: unit.name }, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editUnit(unit: Unit) {
    if (unit.id === '') return;
    let updatedUnit = undefined;
    try {
      const response = await this.Api.put(this.unitUrl, unit, this.config);
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
      await this.Api.delete(`${this.unitUrl}/${id}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default UnitService;
