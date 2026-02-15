import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { Injections } from '@shared/types/injections';
import { centsToReal } from '@shared/utils/number.utils';

import { SubscriptionStatus } from '@payments/domain/entities/subscription.entity';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';
import { UserSubscriptionDto } from '@payments/dtos/user-subscriptions.dto';

@injectable()
export class ListUserSubscriptionsUseCase implements IBaseUseCase<string, UserSubscriptionDto[]> {
  constructor(
    @inject(Injections.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UserSubscriptionDto[]> {
    const subscriptions = await this.subscriptionRepository.listUserSubscriptions(userId);

    return subscriptions.map(subscription => ({
      id: subscription.id as string,
      userId: subscription.userId,
      status: subscription.status as SubscriptionStatus,
      productDescription: subscription.product?.description as string,
      productName: subscription.product?.name as string,
      durationInDays: subscription.product?.durationInDays as number,
      price: centsToReal(subscription.price),
      endAt: subscription.endAt,
      startAt: subscription.startAt,
    }));
  }
}
