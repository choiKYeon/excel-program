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
import type {
  AdminReserveOrderControllerFindManyParams,
  ReserveOrder,
  ReserveOrderList,
  UpdateDispatedTruckDto
} from '../../model'



  /**
 * @summary 관리자 페이지에서 예약 주문 목록 조회하기
 */
export const adminReserveOrderControllerFindMany = <TData = AxiosResponse<ReserveOrderList>>(
    params?: AdminReserveOrderControllerFindManyParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/reserve-order`,{
    ...options,
        params: {...params, ...options?.params},}
    );
  }
/**
 * @summary 관리자 페이지에서 예약 주문 트럭배정
 */
export const adminReserveOrderControllerDispatchTruck = <TData = AxiosResponse<ReserveOrder>>(
    id: string,
    updateDispatedTruckDto: UpdateDispatedTruckDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/reserve-order/${id}/dispatch-truck`,
      updateDispatedTruckDto,options
    );
  }
export type AdminReserveOrderControllerFindManyResult = AxiosResponse<ReserveOrderList>
export type AdminReserveOrderControllerDispatchTruckResult = AxiosResponse<ReserveOrder>
