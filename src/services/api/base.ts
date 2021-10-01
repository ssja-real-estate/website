import axios from 'axios';
import { BASE_URL } from 'local';

const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: {
    'content-type': 'application/json',
  },
});

export default Api;
