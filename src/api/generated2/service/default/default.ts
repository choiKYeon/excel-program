/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import axios from 'axios'
import type {
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'



  export const locationControllerTest = <TData = AxiosResponse<void>>(
     options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/location`,options
    );
  }
