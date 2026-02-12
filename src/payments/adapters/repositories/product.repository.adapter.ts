import { BaseRepository } from '@shared/repositories/base.repository';

import { ProductEntity } from '@payments/domain/entities/product.entity';
import { IProductRepositoryPort } from '@payments/domain/repositories/product.repository.port';

import { PrismaClientSingleton } from '../../../prisma-client';

export class ProductRepositoryAdapter
  extends BaseRepository<ProductEntity>
  implements IProductRepositoryPort
{
  private readonly prisma;

  constructor() {
    const prisma = PrismaClientSingleton.getInstance();

    super(prisma.product);
    this.prisma = prisma;
  }
}
