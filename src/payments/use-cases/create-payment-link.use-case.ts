import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { Injections } from '@shared/types/injections';

import { IUserServicePort } from '@users/services/user.port.service';

import { SubscriptionStatus } from '@payments/domain/entities/subscription.entity';
import { IProductRepositoryPort } from '@payments/domain/repositories/product.repository.port';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';
import {
  CreatePaymentLinkRequestDto,
  PaymentLinkDto,
} from '@payments/dtos/create-payment-link.dto';
import { IPaymentGatewayPort } from '@payments/ports/payment-gateway.port';

@injectable()
export class CreatePaymentLinkUseCase implements IBaseUseCase<
  CreatePaymentLinkRequestDto,
  PaymentLinkDto
> {
  /* eslint-disable max-params */
  constructor(
    @inject(Injections.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepositoryPort,
    @inject(Injections.USER_SERVICE)
    private readonly userService: IUserServicePort,
    @inject(Injections.PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGatewayPort,
    @inject(Injections.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepositoryPort,
  ) {}

  async execute(data: CreatePaymentLinkRequestDto): Promise<PaymentLinkDto> {
    const { userId, productId } = data;

    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new EntityNotFoundError('Product');
    }

    const user = await this.userService.getUserById(userId);

    const paymentLink = await this.paymentGateway.createPaymentLink(user, product);

    /*eslint-disable @typescript-eslint/no-magic-numbers */
    const endAt = new Date(Date.now() + product.durationInDays * 24 * 60 * 60 * 1000);

    await this.subscriptionRepository.create({
      userId,
      productId,
      paymentId: paymentLink.paymentId,
      status: SubscriptionStatus.PENDING_PAYMENT,
      price: product.price,
      startAt: new Date(),
      endAt,
    });

    return {
      url: paymentLink.url,
    };
  }
}
