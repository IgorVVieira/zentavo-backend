import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { UnauthorizedError } from '@shared/errors/unauthorized.error';
import { Injections } from '@shared/types/injections';

import { User } from '@users/domain/entities/user.entity';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { AuthUserResponseDto, LoginDto } from '@users/dtos';
import { IEncryptPort } from '@users/ports/encypt.port';
import { IJwtPort } from '@users/ports/jwt.port';

import { ISubscriptionRepositoryPort } from '@payments/domain/repositories/subscription.repository.port';

@injectable()
export class LoginUseCase implements IBaseUseCase<LoginDto, AuthUserResponseDto> {
  /* eslint-disable max-params */
  constructor(
    @inject(Injections.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @inject(Injections.ENCRYPT_PORT)
    private readonly encrypter: IEncryptPort,
    @inject(Injections.JWT_PORT)
    private readonly jwt: IJwtPort,
    @inject(Injections.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepositoryPort,
  ) {}

  async execute(data: LoginDto): Promise<AuthUserResponseDto> {
    const { email, password } = data;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    const isPasswordValid = await this.encrypter.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password');
    }

    if (!User.isActive(user)) {
      throw new UnauthorizedError('User is not active');
    }

    const hasSubscription = await this.subscriptionRepository.hasSubscriptionActive(
      user.id as string,
    );

    const token = this.jwt.sign({
      id: user.id as string,
      name: user.name,
      email: user.email,
      hasSubscription,
    });

    return {
      id: user.id as string,
      token,
    };
  }
}
