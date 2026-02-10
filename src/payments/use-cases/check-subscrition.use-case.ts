import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { ForbiddenError } from '@shared/errors/forbidden.error';
import { UnauthorizedError } from '@shared/errors/unauthorized.error';
import { Injections } from '@shared/types/injections';

import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';

@injectable()
export class CheckSubscriptionUseCase implements IBaseUseCase<string, void> {
  constructor(
    @inject(Injections.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepositoryPort,
  ) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedError('User not found');
    }

    const hasSubscription = await this.subscriptionRepository.hasSubscriptionActive(userId);

    if (!hasSubscription) {
      throw new ForbiddenError('User does not have an active subscription');
    }
  }
}
