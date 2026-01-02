import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import { CategoryEntity } from '@transactions/domain/entities/category.entity';
import { TransactionType } from '@transactions/domain/entities/transaction.entity';
import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repository.port';

import { prismaClientFactory } from '../../../prisma-client';

@injectable()
export class CategoryRepositoryAdapter
  extends BaseRepository<CategoryEntity>
  implements ICategoryRepositoryPort
{
  private readonly prisma;

  constructor() {
    const prisma = prismaClientFactory();

    super(prisma.category);
    this.prisma = prisma;
  }

  async findByNameAndUserId(name: string, userId: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        name,
        userId,
        deletedAt: null,
      },
    });

    if (!category) {
      return null;
    }

    return {
      ...category,
      type: category.type as TransactionType,
    };
  }

  async findByUserId(userId: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories?.map(category => ({
      ...category,
      type: category.type as TransactionType,
    }));
  }
}
