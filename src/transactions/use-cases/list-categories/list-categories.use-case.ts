import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repositor.port';
import { CategoryDto } from '@transactions/dtos';

@injectable()
export class ListCategoriesUseCase implements IBaseUseCase<string, CategoryDto[]> {
  public constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: ICategoryRepositoryPort,
  ) {}

  public async execute(userId: string): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findByUserId(userId);

    return categories.map(category => ({
      id: category.id as string,
      userId: category.userId,
      name: category.name,
      color: category.color,
      createdAt: category.createdAt as Date,
      updatedAt: category.updatedAt as Date,
    }));
  }
}
