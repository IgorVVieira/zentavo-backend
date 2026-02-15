import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { BillingPaidEventUseCase } from '@payments/use-cases/billing-paid-event.use-case';
import { CreatePaymentLinkUseCase } from '@payments/use-cases/create-payment-link.use-case';
import { ListUserSubscriptionsUseCase } from '@payments/use-cases/list-user-subscriptions.use-case';
import { Request, Response } from 'express';

@injectable()
export class PaymentController {
  constructor(
    @inject(Injections.CREATE_PAYMENT_LINK_USE_CASE)
    private readonly createPaymentLinkUseCase: CreatePaymentLinkUseCase,
    @inject(Injections.BILLING_PAID_EVENT_USE_CASE)
    private readonly billingPaidEventUseCase: BillingPaidEventUseCase,
    @inject(Injections.LIST_USER_SUBSCRIPTIONS_USE_CASE)
    private readonly listUserSubscriptionsUseCase: ListUserSubscriptionsUseCase,
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    const paymentLink = await this.createPaymentLinkUseCase.execute({
      userId: request.userId,
    });

    return response.status(HttpStatus.CREATED).json(paymentLink);
  }

  async billingPaidReceived(request: Request, response: Response): Promise<Response> {
    const webhookSecret = request.query.webhookSecret;

    if (webhookSecret !== process.env.ABACATEPAY_WEBHOOOK_SECRET) {
      return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid webhook secret' });
    }

    await this.billingPaidEventUseCase.execute(request.body);

    return response.status(HttpStatus.OK).json({ success: true });
  }

  async listUserSubscriptions(request: Request, response: Response): Promise<Response> {
    const subscriptions = await this.listUserSubscriptionsUseCase.execute(request.userId);

    return response.status(HttpStatus.OK).json(subscriptions);
  }
}
