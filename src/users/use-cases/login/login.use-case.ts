import { inject, injectable } from 'tsyringe';

import { IBaseUseCase } from '@shared/domain/use-cases/base.use-case';
import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { UnauthorizedError } from '@shared/errors/unauthorized.error';

import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { AuthUserResponseDto, LoginDto } from '@users/dtos';
import { IEncryptPort } from '@users/gateways/encypt.port';
import { IJwtPort } from '@users/gateways/jwt.port';

@injectable()
export class LoginUseCase implements IBaseUseCase<LoginDto, AuthUserResponseDto> {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: IUserRepositoryPort,
    @inject('EncrypterAdapter')
    private readonly encrypter: IEncryptPort,
    @inject('JwtAdapter')
    private readonly jwt: IJwtPort,
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

    const token = this.jwt.sign(user.id as string, user.name, user.email);

    return {
      token,
    };
  }
}
