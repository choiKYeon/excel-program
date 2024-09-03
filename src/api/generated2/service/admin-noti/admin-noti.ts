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
  AdminNotiControllerFindManyParams,
  CreateNotiAdminDto,
  NotiAdmin,
  NotiAdminList,
  OkResponseDto,
  UpdateNotiAdminDto
} from '../../model'



  /**
 * @summary 관리자 페이지에서 알림 목록 조회하기
 */
export const adminNotiControllerFindMany = <TData = AxiosResponse<NotiAdminList>>(
    params?: AdminNotiControllerFindManyParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/admin/noti`,{
    ...options,
        params: {...params, ...options?.params},}
    );
  }
/**
 * @summary 관리자 페이지에서 알림 생성하기
 */
export const adminNotiControllerCreate = <TData = AxiosResponse<NotiAdmin>>(
    createNotiAdminDto: CreateNotiAdminDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.post(
      `/olhso/admin/noti`,
      createNotiAdminDto,options
    );
  }
/**
 * @summary 관리자 페이지에서 알림 수정하기
 */
export const adminNotiControllerUpdate = <TData = AxiosResponse<NotiAdmin>>(
    id: string,
    updateNotiAdminDto: UpdateNotiAdminDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/admin/noti/${id}`,
      updateNotiAdminDto,options
    );
  }
/**
 * @summary 관리자 페이지에서 알림 삭제하기
 */
export const adminNotiControllerDelete = <TData = AxiosResponse<OkResponseDto>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/olhso/admin/noti/${id}`,options
    );
  }
export type AdminNotiControllerFindManyResult = AxiosResponse<NotiAdminList>
export type AdminNotiControllerCreateResult = AxiosResponse<NotiAdmin>
export type AdminNotiControllerUpdateResult = AxiosResponse<NotiAdmin>
export type AdminNotiControllerDeleteResult = AxiosResponse<OkResponseDto>
