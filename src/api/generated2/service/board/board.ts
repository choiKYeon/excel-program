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
  Board,
  BoardControllerFindManyParams,
  BoardList,
  CreateBoardDto,
  UpdateBoardDto
} from '../../model'



  /**
 * @summary 게시글 생성
 */
export const boardControllerCreate = <TData = AxiosResponse<Board>>(
    createBoardDto: CreateBoardDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.post(
      `/olhso/board`,
      createBoardDto,options
    );
  }
/**
 * @summary 게시글 목록 조회
 */
export const boardControllerFindMany = <TData = AxiosResponse<BoardList>>(
    params?: BoardControllerFindManyParams, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/board`,{
    ...options,
        params: {...params, ...options?.params},}
    );
  }
/**
 * @summary 게시글 상세 조회
 */
export const boardControllerFindOne = <TData = AxiosResponse<Board>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.get(
      `/olhso/board/${id}`,options
    );
  }
/**
 * @summary 게시글 수정
 */
export const boardControllerUpdate = <TData = AxiosResponse<Board>>(
    id: string,
    updateBoardDto: UpdateBoardDto, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.put(
      `/olhso/board/${id}`,
      updateBoardDto,options
    );
  }
/**
 * @summary 게시글 삭제
 */
export const boardControllerRemove = <TData = AxiosResponse<Board>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.delete(
      `/olhso/board/${id}`,options
    );
  }
export type BoardControllerCreateResult = AxiosResponse<Board>
export type BoardControllerFindManyResult = AxiosResponse<BoardList>
export type BoardControllerFindOneResult = AxiosResponse<Board>
export type BoardControllerUpdateResult = AxiosResponse<Board>
export type BoardControllerRemoveResult = AxiosResponse<Board>
