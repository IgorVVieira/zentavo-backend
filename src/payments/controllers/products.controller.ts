import { inject, injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';
import { Injections } from '@shared/types/injections';

import { ListProductsUseCase } from '@payments/use-cases/products/list-products.use-case';
import { Request, Response } from 'express';

@injectable()
export class ProductsController {
  constructor(
    @inject(Injections.LIST_PRODUCTS_USE_CASE)
    private readonly listProductsUseCase: ListProductsUseCase,
  ) {}

  async listProducts(req: Request, res: Response): Promise<void> {
    const products = await this.listProductsUseCase.execute();

    res.status(HttpStatus.OK).json(products);
  }
}
