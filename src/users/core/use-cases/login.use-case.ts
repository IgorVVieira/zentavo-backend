import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';

import { AuthUserResponseDto } from 'users/application/dtos/auth-user-response.dto';
import { LoginDto } from 'users/application/dtos/login.dto';
import { IUserRepositoryPort } from 'users/core/domain/repositories/user.repository.port';
import { IEncryptPort } from 'users/core/gateways/encypt.port';
import { IJwtPort } from 'users/core/gateways/jwt.port';

export class LoginUseCase implements IBaseUseCase<LoginDto, AuthUserResponseDto> {
  public constructor(
    private readonly userRepository: IUserRepositoryPort,
    private readonly encrypter: IEncryptPort,
    private readonly jwt: IJwtPort,
  ) {}

  public async execute(data: LoginDto): Promise<AuthUserResponseDto> {
    const { email, password } = data;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    const isPasswordValid = await this.encrypter.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.jwt.sign(user.id as string, user.name, user.email);

    return {
      user: {
        id: user.id as string,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt as Date,
        updatedAt: user.updatedAt as Date,
      },
      token,
    };
  }
}
