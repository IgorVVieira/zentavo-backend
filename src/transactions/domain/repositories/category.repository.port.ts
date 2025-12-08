import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { CategoryEntity } from '@transactions/domain/entities/category.entity';

export interface ICategoryRepositoryPort extends IBaseRepository<CategoryEntity> {
  findByNameAndUserId(name: string, userId: string): Promise<CategoryEntity | null>;
  findByUserId(userId: string): Promise<CategoryEntity[]>;
}
