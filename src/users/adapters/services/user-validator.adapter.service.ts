import { inject, injectable } from 'tsyringe';

import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { Injections } from '@shared/types/injections';

import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { IUserValidatorPort } from '@users/services/user-validator.port';

@injectable()
export class UserValidatorAdapterService implements IUserValidatorPort {
  constructor(
    @inject(Injections.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  async validateUserExists(userId: string): Promise<void> {
    const userExists = await this.userRepository.findOne(userId);

    if (!userExists) {
      throw new EntityNotFoundError('User');
    }
  }
}
