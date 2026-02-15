import { container } from 'tsyringe';

import { Injections } from '@shared/types/injections';

import { AbacatePayAdapter } from '@payments/adapters/abacate-pay.adapter';
import { ProductRepositoryAdapter } from '@payments/adapters/repositories/product.repository.adapter';
import { SubscriptionReposotoryAdapter } from '@payments/adapters/repositories/subscription.repositoy.adapter';
import { PaymentController } from '@payments/controllers/payment.controller';
import { ProductsController } from '@payments/controllers/products.controller';
import { IProductRepositoryPort } from '@payments/domain/repositories/product.repository.port';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';
import { IPaymentGatewayPort } from '@payments/ports/payment-gateway.port';
import { BillingPaidEventUseCase } from '@payments/use-cases/billing-paid-event.use-case';
import { CheckSubscriptionUseCase } from '@payments/use-cases/check-subscrition.use-case';
import { CreatePaymentLinkUseCase } from '@payments/use-cases/create-payment-link.use-case';
import { ListUserSubscriptionsUseCase } from '@payments/use-cases/list-user-subscriptions.use-case';
import { ListProductsUseCase } from '@payments/use-cases/products/list-products.use-case';

container.registerSingleton<IProductRepositoryPort>(
  Injections.PRODUCT_REPOSITORY,
  ProductRepositoryAdapter,
);

container.registerSingleton<ISubscriptionRepositoryPort>(
  Injections.SUBSCRIPTION_REPOSITORY,
  SubscriptionReposotoryAdapter,
);

container.registerSingleton<IPaymentGatewayPort>(Injections.PAYMENT_GATEWAY, AbacatePayAdapter);

container.registerSingleton(Injections.CREATE_PAYMENT_LINK_USE_CASE, CreatePaymentLinkUseCase);
container.registerSingleton(Injections.LIST_PRODUCTS_USE_CASE, ListProductsUseCase);
container.registerSingleton(Injections.CHECK_SUBSCRIPTION_USE_CASE, CheckSubscriptionUseCase);
container.registerSingleton(Injections.BILLING_PAID_EVENT_USE_CASE, BillingPaidEventUseCase);
container.registerSingleton(
  Injections.LIST_USER_SUBSCRIPTIONS_USE_CASE,
  ListUserSubscriptionsUseCase,
);

container.registerSingleton(PaymentController);
container.registerSingleton(ProductsController);

export { container };
