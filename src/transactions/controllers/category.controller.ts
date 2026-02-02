import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '@transactions/use-cases/delete-category/delete-category';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';
import { UpdateCategoryUseCase } from '@transactions/use-cases/update-category/update-category.use-case';
import { Request, Response } from 'express';

@injectable()
export class CategoryController {
  /* eslint-disable max-params */
  constructor(
    @inject(Injections.CREATE_CATEGORY_USE_CASE)
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @inject(Injections.LIST_CATEGORIES_USE_CASE)
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    @inject(Injections.UPDATE_CATEGORY_USE_CASE)
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    @inject(Injections.DELETE_CATEGORY_USE_CASE)
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  async create(request: Request, response: Response): Promise<Response> {
    const category = await this.createCategoryUseCase.execute({
      ...request.body,
      userId: request.userId,
    });

    return response.status(HttpStatus.CREATED).json(category);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const category = await this.updateCategoryUseCase.execute({
      ...request.body,
      id: request.params.id,
      userId: request.userId,
    });

    return response.status(HttpStatus.OK).json(category);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const categories = await this.listCategoriesUseCase.execute(request.userId);

    return response.status(HttpStatus.OK).json(categories);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    await this.deleteCategoryUseCase.execute(request.params.id);

    return response.status(HttpStatus.NO_CONTENT);
  }
}
