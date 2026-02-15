import { BaseRepository } from '@shared/repositories/base.repository';

import {
  SubscriptionEntity,
  SubscriptionStatus,
} from '@payments/domain/entities/subscription.entity';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';

import { PrismaClientSingleton } from '../../../prisma-client';

export class SubscriptionReposotoryAdapter
  extends BaseRepository<SubscriptionEntity>
  implements ISubscriptionRepositoryPort
{
  private readonly prisma;

  constructor() {
    const prisma = PrismaClientSingleton.getInstance();

    super(prisma.subscription);
    this.prisma = prisma;
  }

  async hasSubscriptionActive(userId: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endAt: {
          gte: new Date(),
        },
      },
    });

    return !!subscription;
  }

  async findByPaymentId(paymentId: string): Promise<SubscriptionEntity | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        paymentId,
      },
    });

    if (!subscription) {
      return null;
    }

    return {
      ...subscription,
      status: subscription.status as SubscriptionStatus,
    };
  }

  async listUserSubscriptions(userId: string): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId,
        status: {
          not: SubscriptionStatus.PENDING_PAYMENT,
        },
      },
      include: {
        product: true,
      },
    });

    return subscriptions.map(subscription => ({
      ...subscription,
      status: subscription.status as SubscriptionStatus,
      product: {
        ...subscription.product,
        features: subscription.product.features as Record<string, boolean>,
      },
    }));
  }
}
