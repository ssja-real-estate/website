import BaseService from "../BaseService";

class MapService extends BaseService {
  async searchMap(searchText: string): Promise<any> {
    let result: any = undefined;
    try {
      console.log("requesting");
      const response = await this.MapApi.get("/v4/geocoding", {
        params: {
          address: searchText,
        },
      });
      if (!response.data) return;
      result = response.data;
    } catch (error) {
      this.handleError(error);
    }
    return result;
  }
}

export default MapService;
