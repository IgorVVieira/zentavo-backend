import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { CheckSubscriptionUseCase } from '@payments/use-cases/check-subscrition.use-case';
import { Request, Response } from 'express';

@injectable()
export class SubscriptionController {
  constructor(
    @inject(Injections.CHECK_SUBSCRIPTION_USE_CASE)
    private readonly checkSubscriptionUseCase: CheckSubscriptionUseCase,
  ) {}

  async hasSubscription(req: Request, res: Response): Promise<void> {
    await this.checkSubscriptionUseCase.execute(req.userId);

    res.status(HttpStatus.OK).json({ message: 'User has an active subscription' });
  }
}
