import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { CategoryDto, CreateCategoryDto } from '@transactions/dtos';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '@transactions/use-cases/delete-category';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';

@injectable()
@JsonController('/categories')
export class CategoryController {
  constructor(
    @inject('CreateCategoryUseCase')
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @inject('ListCategoriesUseCase')
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    @inject('DeleteCategoryUseCase')
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
