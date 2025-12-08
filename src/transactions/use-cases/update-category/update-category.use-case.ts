import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { UnauthorizedError } from '@shared/errors/unauthorized.error';
import { Injections } from '@shared/types/injections';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repository.port';
import { CategoryDto } from '@transactions/dtos/category.dto';
import { UpdateCategoryDto } from '@transactions/dtos/update-category.dto';

@injectable()
export class UpdateCategoryUseCase implements IBaseUseCase<UpdateCategoryDto, CategoryDto> {
  constructor(
    @inject(Injections.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryPort,
  ) {}

  async execute(data: UpdateCategoryDto): Promise<CategoryDto> {
    const { id, userId } = data;

    const categoryFound = await this.categoryRepository.findOne(id);

    if (!categoryFound) {
      throw new EntityNotFoundError('Category');
    }

    if (categoryFound.userId !== userId) {
      throw new UnauthorizedError('User not authorized to update this category');
    }

    const category = await this.categoryRepository.update(data.id, {
      color: data.color,
      name: data.name,
      type: data.type,
    });

    return {
      id: category.id as string,
      userId: category.userId,
      name: category.name,
      color: category.color,
      type: category.type,
      createdAt: category.createdAt as Date,
      updatedAt: category.updatedAt as Date,
    };
  }
}
