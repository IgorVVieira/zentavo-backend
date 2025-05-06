import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';

import { UserStatus } from '@users/domain/entities/user.entity';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';

@injectable()
export class ActivateUserUseCase implements IBaseUseCase<string, void> {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    if (user.isActive()) {
      return;
    }

    await this.userRepository.update(user.id as string, {
      status: UserStatus.ACTIVE,
    });
  }
}
