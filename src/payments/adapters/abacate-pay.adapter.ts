import AbacatePay from 'abacatepay-nodejs-sdk';

import { User } from '@users/domain/entities/user.entity';

import { CreatePaymentLinkDtoResponse } from '@payments/dtos/create-payment-link.dto';
import { IPaymentGatewayPort } from '@payments/ports/payment-gateway.port';

import { ProductEntity } from '../domain/entities/product.entity';

export class AbacatePayAdapter implements IPaymentGatewayPort {
  private readonly abacatePay;

  constructor() {
    this.abacatePay = AbacatePay(process.env.ABA_PAY_API_KEY as string);
  }

  async createPaymentLink(
    user: User,
    product: ProductEntity,
  ): Promise<CreatePaymentLinkDtoResponse> {
    const { data } = await this.abacatePay.billing.create({
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: product.gatewayProductId,
          name: product.name,
          quantity: 1,
          price: product.price, // Amount in cents
        },
      ],
      returnUrl: process.env.FRONTEND_URL as string,
      completionUrl: `${process.env.FRONTEND_URL}/payment/success`,
      customer: {
        name: user.name,
        email: user.email,
      },
    });

    if (!data?.id) {
      throw new Error('Failed to create payment link');
    }

    return {
      url: data?.url,
      paymentId: data?.id,
      customerId: data.customer.id,
    };
  }
}
