import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Strings from "../../global/constants/strings";
// import toast from "../../react-hot-toast";

class BaseService {
  protected Api: AxiosInstance;
  protected config: AxiosRequestConfig | undefined;
  protected MapApi: AxiosInstance;

    private baseUrl = "https://ssja.ir/api";
  //  private baseUrl = "http://localhost:5001/api";
   private mapBaseUrl = "https://api.neshan.org";

  constructor() {
    this.Api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        "content-type": "application/json",
      },
    });
    this.MapApi = axios.create({
      baseURL: this.mapBaseUrl,
      timeout: 10000,
      headers: {
        "content-type": "application/json",
        "Api-Key": `${process.env.REACT_APP_MAP_SERVICE_API_KEY}`,
      },
    });
  }

  setToken(token: string) {
    this.config = {
      headers: {
        Authorization: token,
        "Content-Type": "application/json; charset=utf-8",
      },
    };
  }

  handleError(error: any) {


    if (!error.isAxiosError) {
      this.toastUnknownError(error);
      return;
    }

    let response = (error as AxiosError<any>).response;
    if (response && response?.data) {
      if (!response.data.error) {
        this.toastStatusError(error);
        return;
      } else {
      
        throw response.data.error;
      }
    } else {
      this.toastStatusError(error);
      throw error;
  
    }
  }

  private toastStatusError(error: AxiosError) {
   

    if (!error.response) {
      this.toastUnknownError(error);
      return;
    }

    const status = error.response.status;
 

    let message = this.buildErrorMessage(status);
    
    throw message;
  }

  private buildErrorMessage(status: number) {
    let result = `کد خطا: ${status.toString()} - `;
    if (status >= 400 && status <= 499) {
      switch (status) {
        case 400:
          result += Strings.client400Error;
          break;
        case 404:
          result += Strings.client404Error;
          break;
        case 405:
          result += Strings.client405Error;
          break;
        default:
          result += Strings.clientUnknownError;
          break;
      }
    } else if (status >= 500 && status <= 599) {
      result += Strings.unknownServerError;
    } else {
      result += Strings.unknownError;
    }

    return result;
  }

  private toastUnknownError(error: any) {
    // toast.error(Strings.unknownError);
    alert(error);
    throw Strings.unknownError;
  }
}

export default BaseService;
