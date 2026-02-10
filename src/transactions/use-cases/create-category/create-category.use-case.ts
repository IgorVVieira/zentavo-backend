import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';
import { Injections } from '@shared/types/injections';

import { IUserServicePort } from '@users/services/user.port.service';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repository.port';
import { CategoryDto, CreateCategoryDto } from '@transactions/dtos';

@injectable()
export class CreateCategoryUseCase implements IBaseUseCase<CreateCategoryDto, CategoryDto> {
  constructor(
    @inject(Injections.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepositoryPort,
    @inject(Injections.USER_SERVICE)
    private readonly userValidator: IUserServicePort,
  ) {}

  async execute(data: CreateCategoryDto): Promise<CategoryDto> {
    const categoryExists = await this.categoryRepository.findByNameAndUserId(
      data.name,
      data.userId,
    );

    await this.userValidator.validateUserExists(data.userId);

    if (categoryExists) {
      throw new EntityAlreadyExistsError('Category');
    }

    const category = await this.categoryRepository.create(data);

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
