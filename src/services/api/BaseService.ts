import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Strings from "global/constants/strings";
import toast from "react-hot-toast";

class BaseService {
  protected Api: AxiosInstance;
  protected config: AxiosRequestConfig | undefined;

  private baseUrl = "https://ssja.ir/api";

  constructor() {
    this.Api = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  setToken(token: string) {
    this.config = {
      headers: {
        Authorization: token,
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
        toast.error(response.data.error);
      }
    } else {
      this.toastStatusError(error);
      return;
    }
  }

  private toastStatusError(error: AxiosError) {
    if (!error.response) {
      this.toastUnknownError(error);
      return;
    }

    const status = error.response.status;
    let message = this.buildErrorMessage(status);
    toast.error(message);
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
    toast.error(Strings.unknownError);
    console.log(error.message);
  }
}

export default BaseService;
