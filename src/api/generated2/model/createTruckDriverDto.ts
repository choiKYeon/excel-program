/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import type { CreateTruckDriverDtoRoles } from './createTruckDriverDtoRoles';
import type { CreateTruckDriverDtoStatus } from './createTruckDriverDtoStatus';

export interface CreateTruckDriverDto {
  email: string;
  firstName?: string;
  lastName?: string;
  note?: string;
  /**
   * 
      Password must be at least 8 characters long, contain at least 1 uppercase letter,
      1 lowercase letter, 1 number and 1 special character.
   * @minLength 8
   */
  password: string;
  phoneNum: string;
  profileImageId?: string;
  roles?: CreateTruckDriverDtoRoles;
  status?: CreateTruckDriverDtoStatus;
}
