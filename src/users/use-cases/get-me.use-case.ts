import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';

import { UserDto } from '@users/application/dtos';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';

@injectable()
export class GetMeUseCase implements IBaseUseCase<string, UserDto> {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  public async execute(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    return {
      id: user.id as string,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt as Date,
      updatedAt: user.updatedAt as Date,
    };
  }
}
