import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { Injections } from '@shared/types/injections';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repository.port';
import { CategoryDto } from '@transactions/dtos';

@injectable()
export class ListCategoriesUseCase implements IBaseUseCase<string, CategoryDto[]> {
  constructor(
    @inject(Injections.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryPort,
  ) {}

  async execute(userId: string): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findByUserId(userId);

    return categories.map(category => ({
      id: category.id as string,
      userId: category.userId,
      name: category.name,
      color: category.color,
      type: category.type,
      createdAt: category.createdAt as Date,
      updatedAt: category.updatedAt as Date,
    }));
  }
}
