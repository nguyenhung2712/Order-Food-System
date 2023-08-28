import axios from 'axios';
import { getToken } from './get-token';
import Cookies from 'js-cookie';
import firebase from '@utils/firebase';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  },
});

export const http1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  },
});

// Change request data/error here
http1.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ''}`,
    };
    return config;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error);
  }
);

http1.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    /* firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log(err.response);
                return;
            }
        }); */
    if (originalConfig.url !== '/auth/signin' && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await http1.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/refreshtoken`,
            {
              refreshToken: Cookies.get('refresh_token'),
            }
          );

          const { accessToken } = rs.data;

          Cookies.set('auth_token', accessToken);
          return http(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default http;
