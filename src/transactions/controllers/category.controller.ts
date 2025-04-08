/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';
import { ListCategoriesUseCase } from '@transactions/use-cases/list-categories/list-categories.use-case';
import { Request, Response } from 'express';

@injectable()
export class CategoryController {
  public constructor(
    @inject('CreateCategoryUseCase')
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @inject('ListCategoriesUseCase')
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

  public async create(req: Request, resp: Response): Promise<any> {
    const { name, color } = req.body;

    const userId = req.userId;

    const category = await this.createCategoryUseCase.execute({
      userId,
      name,
      color,
    });

    resp.status(HttpStatus.CREATED).json(category);
  }

  public async list(req: Request, resp: Response): Promise<any> {
    const userId = req.userId;

    const categories = await this.listCategoriesUseCase.execute(userId);

    resp.status(HttpStatus.OK).json(categories);
  }
}
