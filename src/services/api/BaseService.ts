import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BASE_URL } from 'local';

class BaseService {
  protected Api: AxiosInstance;
  protected config: AxiosRequestConfig | undefined;

  constructor(token: string) {
    this.Api = axios.create({
      baseURL: BASE_URL,
      timeout: 2000,
      headers: {
        'content-type': 'application/json',
      },
    });

    this.config = {
      headers: {
        Authorization: token,
      },
    };
  }
}

export default BaseService;
