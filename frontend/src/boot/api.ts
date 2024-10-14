import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Ion } from 'cesium';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

window.CESIUM_BASE_URL = '/cesium';
if (process.env.CESIUM_ACCESS_TOKEN) {
  Ion.defaultAccessToken = process.env.CESIUM_ACCESS_TOKEN;
}

const cdnUrl = 'https://enacit4r-cdn.epfl.ch/';

const baseUrl = `${process.env.API_URL}${process.env.API_PATH}`;

const api = axios.create({
  baseURL: baseUrl,
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, baseUrl, cdnUrl };
