/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * OLHSO API
 * The OLHSO API description
 * OpenAPI spec version: 0.1
 */
import type { DeliveryQuestionDto } from './deliveryQuestionDto';
import type { MenuQuestionDto } from './menuQuestionDto';
import type { PublicQuestionDto } from './publicQuestionDto';

export interface AnswerItem {
  deliveryQuestion: DeliveryQuestionDto[];
  menuQuestion: MenuQuestionDto[];
  publicQuestion?: PublicQuestionDto[];
}
