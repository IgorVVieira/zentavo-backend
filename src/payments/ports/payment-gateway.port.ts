import { User } from '@users/domain/entities/user.entity';

import { CreatePaymentLinkDtoResponse } from '@payments/dtos/create-payment-link.dto';

import { ProductEntity } from '../domain/entities/product.entity';

export interface IPaymentGatewayPort {
  createPaymentLink(user: User, product: ProductEntity): Promise<CreatePaymentLinkDtoResponse>;
}
