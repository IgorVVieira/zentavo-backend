import { SubscriptionStatus } from '@payments/domain/entities/subscription.entity';

export class UserSubscriptionDto {
  id: string;
  userId: string;
  productName: string;
  productDescription: string;
  durationInDays: number;
  price: number;
  status: SubscriptionStatus;
  startAt: string | Date;
  endAt: string | Date;
}
