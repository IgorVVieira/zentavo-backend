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

  // @OpenAPI({
  //   summary: 'Create a new category',
  //   description: 'Create a new category for the user',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '201': {
  //       description: 'Category created successfully',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid data',
  //     },
  //   },
  // })
  // @ResponseSchema(CategoryDto)
  async create(request: Request, response: Response): Promise<Response> {
    const category = await this.createCategoryUseCase.execute({
      ...request.body,
      userId: request.userId,
    });

    return response.status(HttpStatus.CREATED).json(category);
  }

  // @Authorized()
  // @OpenAPI({
  //   summary: 'Update a category',
  //   description: 'Update a category by ID',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '200': {
  //       description: 'Category updated successfully',
  //     },
  //     '400': {
  //       description: 'Bad request - Invalid data',
  //     },
  //     '404': {
  //       description: 'Category not found',
  //     },
  //   },
  // })
  // @ResponseSchema(CategoryDto)
  async update(request: Request, response: Response): Promise<Response> {
    const category = await this.updateCategoryUseCase.execute({
      ...request.body,
      id: request.params.id,
      userId: request.userId,
    });

    return response.status(HttpStatus.OK).json(category);
  }

  // @OpenAPI({
  //   summary: 'List categories',
  //   description: 'List all categories for the user',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '200': {
  //       description: 'Categories retrieved successfully',
  //     },
  //   },
  // })
  // @ResponseSchema(CategoryDto, { isArray: true })
  async list(request: Request, response: Response): Promise<Response> {
    const categories = await this.listCategoriesUseCase.execute(request.userId);

    return response.status(HttpStatus.OK).json(categories);
  }

  // @OpenAPI({
  //   summary: 'Delete a category',
  //   description: 'Delete a category by ID',
  //   security: [{ bearerAuth: [] }],
  //   responses: {
  //     '204': {
  //       description: 'Category deleted successfully',
  //     },
  //     '404': {
  //       description: 'Category not found',
  //     },
  //   },
  // })
  // @ResponseSchema('', { statusCode: 204 })
  async delete(request: Request, response: Response): Promise<Response> {
    await this.deleteCategoryUseCase.execute(request.params.id);

    return response.status(HttpStatus.NO_CONTENT);
  }
}
