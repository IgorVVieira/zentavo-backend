import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

import { BaseRepository } from '@shared/repositories/base.repository';

import { CategoryEntity } from '@transactions/domain/entities/category';
import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repositor.port';

@injectable()
export class CategoryRepositoryAdapter
  extends BaseRepository<CategoryEntity>
  implements ICategoryRepositoryPort
{
  private readonly prisma: PrismaClient;

  constructor() {
    const prisma = new PrismaClient();

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

    return category;
  }

  async findByUserId(userId: string): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
