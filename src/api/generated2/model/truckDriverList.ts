/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import type { TruckDriver } from './truckDriver';
import type { PaginationMeta } from './paginationMeta';

export interface TruckDriverList {
  items: TruckDriver[];
  meta: PaginationMeta;
}
