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
  AdminTruckControllerFindManyParams,
  CreateTruckDto,
  Truck,
  TruckArea,
  TruckCoordinates,
  TruckList,
  TruckSlotArray,
  UpdateTruckDto
} from '../../model'



  /**
 * @summary 트럭 생성
 */
export const adminTruckControllerCreate = <TData = AxiosResponse<Truck>>(
    createTruckDto: CreateTruckDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.post(
      `/olhso/admin/trucks`,
      createTruckDto,options
    );
  }
/**
 * @summary 트럭 목록 조회
 */
export const adminTruckControllerFindMany = <TData = AxiosResponse<TruckList>>(
    params?: AdminTruckControllerFindManyParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/trucks`,{
    ...options,
        params: {...params, ...options?.params},}
    );
  }
/**
 * @summary 관할 지역 정보 모두 조회
 */
export const adminTruckControllerFindAllTruckAreas = <TData = AxiosResponse<TruckArea[]>>(
     options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/trucks/areas`,options
    );
  }
/**
 * @summary 트럭이 가질 수 있는 slot의 행, 열 정보 조회
 */
export const adminTruckControllerFindTruckSlotInfo = <TData = AxiosResponse<TruckSlotArray[]>>(
     options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/trucks/slot-info`,options
    );
  }
/**
 * @summary 단일 트럭 조회
 */
export const adminTruckControllerFindOne = <TData = AxiosResponse<Truck>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/trucks/${id}`,options
    );
  }
/**
 * @summary 트럭 정보 업데이트
 */
export const adminTruckControllerUpdate = <TData = AxiosResponse<Truck>>(
    id: string,
    updateTruckDto: UpdateTruckDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/trucks/${id}`,
      updateTruckDto,options
    );
  }
/**
 * @summary 트럭 삭제
 */
export const adminTruckControllerRemove = <TData = AxiosResponse<void>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/olhso/admin/trucks/${id}`,options
    );
  }
/**
 * @summary 트럭 관계와 연관있는 데이터 함께 조회
 */
export const adminTruckControllerFindOneWithRelations = <TData = AxiosResponse<Truck>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/trucks/${id}/detail`,options
    );
  }
/**
 * @summary 트럭 좌표 업데이트
 */
export const adminTruckControllerUpdateCoordinates = <TData = AxiosResponse<Truck>>(
    id: string,
    truckCoordinates: TruckCoordinates, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/trucks/${id}/coordinates`,
      truckCoordinates,options
    );
  }
/**
 * @summary 관리자 페이지에서 트럭의 긴급 정지 요청
 */
export const adminTruckControllerUpdateEmergency = <TData = AxiosResponse<Truck>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/trucks/${id}/emergency`,undefined,options
    );
  }
/**
 * @summary 관리자 페이지에서 트럭의 활성화 요청
 */
export const adminTruckControllerUpdateActivate = <TData = AxiosResponse<Truck>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/trucks/${id}/activate`,undefined,options
    );
  }
/**
 * @summary 관리자 페이지에서 트럭의 비활성화 요청
 */
export const adminTruckControllerUpdateDeactivate = <TData = AxiosResponse<Truck>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/trucks/${id}/deactivate`,undefined,options
    );
  }
export type AdminTruckControllerCreateResult = AxiosResponse<Truck>
export type AdminTruckControllerFindManyResult = AxiosResponse<TruckList>
export type AdminTruckControllerFindAllTruckAreasResult = AxiosResponse<TruckArea[]>
export type AdminTruckControllerFindTruckSlotInfoResult = AxiosResponse<TruckSlotArray[]>
export type AdminTruckControllerFindOneResult = AxiosResponse<Truck>
export type AdminTruckControllerUpdateResult = AxiosResponse<Truck>
export type AdminTruckControllerRemoveResult = AxiosResponse<void>
export type AdminTruckControllerFindOneWithRelationsResult = AxiosResponse<Truck>
export type AdminTruckControllerUpdateCoordinatesResult = AxiosResponse<Truck>
export type AdminTruckControllerUpdateEmergencyResult = AxiosResponse<Truck>
export type AdminTruckControllerUpdateActivateResult = AxiosResponse<Truck>
export type AdminTruckControllerUpdateDeactivateResult = AxiosResponse<Truck>
