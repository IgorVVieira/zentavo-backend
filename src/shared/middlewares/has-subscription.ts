import { container } from 'tsyringe';

import { CheckSubscriptionUseCase } from '@payments/use-cases/check-subscrition.use-case';
import { NextFunction, Request, Response } from 'express';

export const hasSubscriptionMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const checkSubscriptionUseCase = container.resolve(CheckSubscriptionUseCase);
  const { userId } = req;

  await checkSubscriptionUseCase.execute(userId);

  return next();
};
