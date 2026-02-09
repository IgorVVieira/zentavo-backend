import { container } from 'tsyringe';

import { Injections } from '@shared/types/injections';

import { ProductRepositoryAdapter } from '@payments/adapters/repositories/product.repository.adapter';
import { SubscriptionReposotoryAdapter } from '@payments/adapters/repositories/subscription.repositoy.adapter';
import { IProductRepositoryPort } from '@payments/domain/repositories/product.repository.port';
import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';

container.registerSingleton<IProductRepositoryPort>(
  Injections.PRODUCT_REPOSITORY,
  ProductRepositoryAdapter,
);

container.registerSingleton<ISubscriptionRepositoryPort>(
  Injections.SUBSCRIPTION_REPOSITORY,
  SubscriptionReposotoryAdapter,
);

export { container };
