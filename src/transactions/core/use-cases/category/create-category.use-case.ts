import { injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

import { CreateCategoryDto } from '@transactions/application/dto/in/create-category.dto';
import { CategoryDto } from '@transactions/application/dto/out/category.dto';
import { ICategoryRepositoryPort } from '@transactions/core/domain/repositories/category.repositor.port';

@injectable()
export class CreateCategoryUseCase implements IBaseUseCase<CreateCategoryDto, CategoryDto> {
  public constructor(private readonly categoryRepository: ICategoryRepositoryPort) {}

  public async execute(data: CreateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoryRepository.create(data);

    return {
      id: category.id as string,
      userId: category.userId,
      name: category.name,
      color: category.color,
      createdAt: category.createdAt as Date,
      updatedAt: category.updatedAt as Date,
    };
  }
}
