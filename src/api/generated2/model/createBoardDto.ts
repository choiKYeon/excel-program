/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import type { BoardType } from './boardType';

export interface CreateBoardDto {
  activated?: boolean;
  content?: string;
  order?: number;
  title: string;
  type?: BoardType;
}
