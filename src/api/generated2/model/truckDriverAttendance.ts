/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import type { TruckDriver } from './truckDriver';
import type { Truck } from './truck';

export interface TruckDriverAttendance {
  createdAt: string;
  driver: TruckDriver;
  id: string;
  offAttTime?: string;
  onAttTime: string;
  truck: Truck;
  updatedAt: string;
  workingDate: string;
}
