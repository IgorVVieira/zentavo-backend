import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { Injections } from '@shared/types/injections';

import { AbacatePayBillingStatus } from '@payments/abacate-pay/enums';
import { AbacatePayWebhookEvent } from '@payments/abacate-pay/enums/webhook-event.enum';
import { IAbacatePayBillingPaidWebhook } from '@payments/abacate-pay/types';
import {
  SubscriptionEntity,
  SubscriptionStatus,
} from '@payments/domain/entities/subscription.entity';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';

@injectable()
export class BillingPaidEventUseCase implements IBaseUseCase<IAbacatePayBillingPaidWebhook, void> {
  constructor(
    @inject(Injections.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepositoryPort,
  ) {}

  async execute(data: IAbacatePayBillingPaidWebhook): Promise<void> {
    if (data.event !== AbacatePayWebhookEvent.BILLING_PAID) {
      return;
    }
    const { billing } = data.data || {};

    const subscription = await this.subscriptionRepository.findByPaymentId(billing.id);

    if (!subscription) {
      throw new EntityNotFoundError('Subscription not found');
    }

    if (!this.isValidSubscriptionPayment(subscription, data)) {
      throw new Error('Method not implemented.');
    }

    await this.subscriptionRepository.update(subscription.id as string, {
      status: SubscriptionStatus.ACTIVE,
      price: billing.paidAmount,
    });
  }

  private isValidSubscriptionPayment(
    subscription: SubscriptionEntity,
    payload: IAbacatePayBillingPaidWebhook,
  ): boolean {
    const { billing } = payload.data || {};

    if (billing.status !== AbacatePayBillingStatus.PAID) {
      return false;
    }

    if (subscription.price !== billing.amount) {
      return false;
    }

    if (subscription.productId !== billing.products[0]?.externalId) {
      return false;
    }

    return true;
  }
}
