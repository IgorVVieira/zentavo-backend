import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';

import { IUserValidatorPort } from '@users/services/user-validator.port';

import { ICategoryRepositoryPort } from '@transactions/domain/repositories/category.repositor.port';
import { CategoryDto, CreateCategoryDto } from '@transactions/dtos';

@injectable()
export class CreateCategoryUseCase implements IBaseUseCase<CreateCategoryDto, CategoryDto> {
  public constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: ICategoryRepositoryPort,
    @inject('UserValidator')
    private readonly userValidator: IUserValidatorPort,
  ) {}

  public async execute(data: CreateCategoryDto): Promise<CategoryDto> {
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
      createdAt: category.createdAt as Date,
      updatedAt: category.updatedAt as Date,
    };
  }
}
