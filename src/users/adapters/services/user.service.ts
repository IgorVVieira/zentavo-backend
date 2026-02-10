import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { Injections } from '@shared/types/injections';

import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { UserDto } from '@users/dtos';
import { IUserServicePort } from '@users/services/user.port.service';

@injectable()
export class UserService implements IUserServicePort {
  constructor(
    @inject(Injections.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @inject(Injections.GET_ME_USE_CASE)
    private readonly getMeUseCase: IBaseUseCase<string, UserDto>,
  ) {}

  async validateUserExists(userId: string): Promise<void> {
    const userExists = await this.userRepository.findOne(userId);

    if (!userExists) {
      throw new EntityNotFoundError('User');
    }
  }

  async getUserById(userId: string): Promise<UserDto> {
    return this.getMeUseCase.execute(userId);
  }
}
