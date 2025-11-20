import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { Injections } from '@shared/types/injections';

import { CategoryDto, CreateCategoryDto } from '@transactions/dtos';
import { UpdateCategoryDto } from '@transactions/dtos/update-category.dto';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '@transactions/use-cases/delete-category/delete-category';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';
import { UpdateCategoryUseCase } from '@transactions/use-cases/update-category/update-category.use-case';

@injectable()
@JsonController('/categories')
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

  @Post('/')
  @Authorized()
  @OpenAPI({
    summary: 'Create a new category',
    description: 'Create a new category for the user',
    security: [{ bearerAuth: [] }],
    responses: {
      '201': {
        description: 'Category created successfully',
      },
      '400': {
        description: 'Bad request - Invalid data',
      },
    },
  })
  @ResponseSchema(CategoryDto)
  async create(
    @CurrentUser() userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const { name, color } = createCategoryDto;

    return this.createCategoryUseCase.execute({
      userId,
      name,
      color,
    });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({
    summary: 'Update a category',
    description: 'Update a category by ID',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Category updated successfully',
      },
      '400': {
        description: 'Bad request - Invalid data',
      },
      '404': {
        description: 'Category not found',
      },
    },
  })
  @ResponseSchema(CategoryDto)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() userId: string,
  ): Promise<CategoryDto> {
    return this.updateCategoryUseCase.execute({
      ...updateCategoryDto,
      id,
      userId,
    });
  }

  @Get('/')
  @Authorized()
  @OpenAPI({
    summary: 'List categories',
    description: 'List all categories for the user',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'Categories retrieved successfully',
      },
    },
  })
  @ResponseSchema(CategoryDto, { isArray: true })
  async list(@CurrentUser() userId: string): Promise<CategoryDto[]> {
    return this.listCategoriesUseCase.execute(userId);
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({
    summary: 'Delete a category',
    description: 'Delete a category by ID',
    security: [{ bearerAuth: [] }],
    responses: {
      '204': {
        description: 'Category deleted successfully',
      },
      '404': {
        description: 'Category not found',
      },
    },
  })
  @ResponseSchema('', { statusCode: 204 })
  async delete(@CurrentUser() userId: string, @Param('id') id: string): Promise<string> {
    await this.deleteCategoryUseCase.execute(id);

    return 'Category deleted successfully';
  }
}
