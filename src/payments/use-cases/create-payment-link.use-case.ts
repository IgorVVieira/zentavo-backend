import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';

export class CreatePaymentLinkUseCase implements IBaseUseCase<
  { userId: string; productId: string },
  string
> {
  async execute(_data: { userId: string; productId: string }): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
