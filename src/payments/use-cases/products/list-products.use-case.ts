import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { Injections } from '@shared/types/injections';
import { centsToReal } from '@shared/utils/number.utils';

import { IProductRepositoryPort } from '@payments/domain/repositories/product.repository.port';
import { ProductDto } from '@payments/dtos/product.dto';

@injectable()
export class ListProductsUseCase implements IBaseUseCase<void, ProductDto[]> {
  constructor(
    @inject(Injections.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepositoryPort,
  ) {}

  async execute(_data: void): Promise<ProductDto[]> {
    const products = await this.productRepository.findAll();

    return products.map(product => ({
      id: product.id as string,
      name: product.name,
      price: centsToReal(product.price),
      description: product.description,
    }));
  }
}
