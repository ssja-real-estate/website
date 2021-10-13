import City from 'global/types/City';
import Province from 'global/types/Province';
import { CITY_URL, PROVINCE_URL } from 'local';
import BaseService from '../BaseService';

class ProvinceCityService extends BaseService {
  async getAllProvinces() {
    let provinces: Province[] = [];

    try {
      const response = await this.Api.get(PROVINCE_URL, this.config);

      if (response.data) {
        response.data.forEach((element: Province) => {
          provinces.push(element);
        });
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return provinces;
  }

  async createProvince(province: Province) {
    try {
      await this.Api.post(PROVINCE_URL, { name: province.name }, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editProvince(province: Province) {
    if (province.id === '') return;
    let newProvince = undefined;
    try {
      const response = await this.Api.put(PROVINCE_URL, province, this.config);
      if (response.data) {
        newProvince = response.data as Province;
      }
    } catch (error: any) {
      this.handleError(error);
    }
    return newProvince;
  }

  async deleteProvince(id: string) {
    try {
      await this.Api.delete(`${PROVINCE_URL}/${id}`, this.config);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getProvinceCities(provinceId: string) {
    let cities: City[] = [];

    try {
      const response = await this.Api.get(PROVINCE_URL, this.config);
      if (response.data) {
        if (response.data.cities) {
          cities = response.data.cities as City[];
        }
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return cities;
  }

  async createCityInProvince(provinceId: string, city: City) {
    try {
      await this.Api.post(
        `${PROVINCE_URL}${CITY_URL}/${provinceId}`,
        { name: city.name },
        this.config
      );
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async editCityInProvince(provinceId: string, city: City) {
    if (provinceId === '' || city.id === '') return;

    let updatedCity = undefined;
    try {
      console.log('city service 0');
      const response = await this.Api.put(
        `${PROVINCE_URL}${CITY_URL}/${provinceId}`,
        city,
        this.config
      );
      console.log('city service 1');
      if (response.data) {
        console.log('city service 2');
        updatedCity = response.data as City;
      }
    } catch (error: any) {
      this.handleError(error);
    }

    return updatedCity;
  }

  async deleteCityInProvince(provinceId: string, city: City) {
    try {
      await this.Api.delete(`${PROVINCE_URL}${CITY_URL}/${provinceId}`, {
        ...this.config,
        data: {
          id: city.id,
          name: city.name,
        },
      });
    } catch (error: any) {
      this.handleError(error);
    }
  }
}

export default ProvinceCityService;
