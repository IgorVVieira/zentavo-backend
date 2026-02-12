import { UserDto } from '@users/dtos';

import { CreatePaymentLinkDtoResponse } from '@payments/dtos/create-payment-link.dto';

import { ProductEntity } from '../domain/entities/product.entity';

export interface IPaymentGatewayPort {
  createPaymentLink(user: UserDto, product: ProductEntity): Promise<CreatePaymentLinkDtoResponse>;
}
