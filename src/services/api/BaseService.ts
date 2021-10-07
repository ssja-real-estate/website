import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Strings from 'global/constants/strings';
import { BASE_URL } from 'local';
import toast from 'react-hot-toast';

class BaseService {
  protected Api: AxiosInstance;
  protected config: AxiosRequestConfig | undefined;

  constructor() {
    this.Api = axios.create({
      baseURL: BASE_URL,
      timeout: 2000,
      headers: {
        'content-type': 'application/json',
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

    let response = (error as AxiosError).response;
    if (response && response?.data) {
      toast.error(response.data.error);
    } else {
      this.toastUnknownError(error);
    }
  }

  private toastUnknownError(error: any) {
    toast.error(Strings.unknownError);
    console.log(error.message);
  }
}

export default BaseService;
