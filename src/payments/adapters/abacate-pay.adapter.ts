import { injectable } from 'tsyringe';

import { UserDto } from '@users/dtos';

import { abacatePayInstance } from '@payments/abacate-pay/abacate-pay-instance';
import {
  AbacatePayBillingFrequency,
  AbacatePayPaymentMethod,
  AbacatePayRoutes,
} from '@payments/abacate-pay/enums';
import {
  IAbacatePayBaseResponse,
  IAbacatePayCreateBillingRequest,
  IAbacatePayCreateBillingResponse,
} from '@payments/abacate-pay/types';
import { CreatePaymentLinkDtoResponse } from '@payments/dtos/create-payment-link.dto';
import { IPaymentGatewayPort } from '@payments/ports/payment-gateway.port';

import { ProductEntity } from '../domain/entities/product.entity';

@injectable()
export class AbacatePayAdapter implements IPaymentGatewayPort {
  async createPaymentLink(
    user: UserDto,
    product: ProductEntity,
  ): Promise<CreatePaymentLinkDtoResponse> {
    const body: IAbacatePayCreateBillingRequest = {
      frequency: AbacatePayBillingFrequency.ONE_TIME,
      methods: [AbacatePayPaymentMethod.PIX],
      products: [
        {
          externalId: product.id as string,
          name: product.name,
          quantity: 1,
          description: product.description,
          price: product.price,
        },
      ],
      returnUrl: process.env.FRONTEND_URL as string,
      completionUrl: `${process.env.FRONTEND_URL}/payment/success`,
      customer: {
        name: user.name,
        email: user.email,
        taxId: '71995021091',
        cellphone: '31999999999',
      },
      // ...(user.id && { customerId: user.id }),
      allowCoupons: true,
    };

    const {
      data: { data },
    } = await abacatePayInstance.post<IAbacatePayBaseResponse<IAbacatePayCreateBillingResponse>>(
      AbacatePayRoutes.CREATE_PAYMENT_LINK,
      body,
    );

    if (!data?.id) {
      throw new Error('Failed to create payment link');
    }

    return {
      url: data?.url,
      paymentId: data?.id,
      customerId: data?.customer?.id as string,
    };
  }
}
