import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { ProductEntity } from '../entities/product.entity';

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface IProductRepositoryPort extends IBaseRepository<ProductEntity> {}
