import { container } from 'tsyringe';

import { ForbiddenError } from '@shared/errors/forbidden.error';
import { UnauthorizedError } from '@shared/errors/unauthorized.error';

import { SubscriptionReposotoryAdapter } from '@payments/adapters/repositories/subscription.repositoy.adapter';
import { NextFunction, Request, Response } from 'express';

export const hasSubscriptionMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const subscriptionRepository = container.resolve(SubscriptionReposotoryAdapter);
  const { userId } = req;

  if (!userId) {
    throw new UnauthorizedError('User not found');
  }

  const hasSubscription = await subscriptionRepository.hasSubscriptionActive(userId);

  if (!hasSubscription) {
    throw new ForbiddenError('User does not have an active subscription');
  }

  return next();
};
