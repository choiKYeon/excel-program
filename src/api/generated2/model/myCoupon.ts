/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import type { Menu } from './menu';
import type { DiscountType } from './discountType';
import type { PromotionType } from './promotionType';
import type { MyCouponStatus } from './myCouponStatus';

export interface MyCoupon {
  activated?: boolean;
  description?: string;
  discountAmount?: number;
  discountMenu?: Menu[];
  discountRatio?: number;
  discountType: DiscountType;
  expiration?: string;
  id: string;
  minPayAmount?: number;
  promotionType: PromotionType;
  quantity: number;
  startDate?: string;
  status?: MyCouponStatus;
  title?: string;
}
