import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { CreatePaymentLinkUseCase } from '@payments/use-cases/create-payment-link.use-case';
import { Request, Response } from 'express';

@injectable()
export class PaymentController {
  constructor(
    @inject(Injections.CREATE_PAYMENT_LINK_USE_CASE)
    private readonly createPaymentLinkUseCase: CreatePaymentLinkUseCase,
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    const paymentLink = await this.createPaymentLinkUseCase.execute({
      productId: request.body.productId,
      userId: request.userId,
    });

    return response.status(HttpStatus.CREATED).json(paymentLink);
  }
}
