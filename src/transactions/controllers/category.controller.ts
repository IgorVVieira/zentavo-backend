import { Authorized, Body, CurrentUser, Get, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';

import { CategoryDto, CreateCategoryDto } from '@transactions/dtos';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';

@injectable()
@JsonController('/categories')
@Authorized()
export class CategoryController {
  constructor(
    @inject('CreateCategoryUseCase')
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @inject('ListCategoriesUseCase')
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

  @Post('/')
  @OpenAPI({
    summary: 'Create a new category',
    description: 'Create a new category for the user',
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
  @OpenAPI({
    summary: 'List categories',
    description: 'List all categories for the user',
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
}
