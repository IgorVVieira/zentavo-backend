import { container } from 'tsyringe';

import { EncptyAdapter } from '@users/adapters/gateways/encypt.adapter';
import { JwtAdapter } from '@users/adapters/gateways/jwt.adapter';
import { UserRepositoryAdapter } from '@users/adapters/repositories/user.repository.adapter';
import { IUserRepositoryPort } from '@users/core/domain/repositories/user.repository.port';
import { IEncryptPort } from '@users/core/gateways/encypt.port';
import { IJwtPort } from '@users/core/gateways/jwt.port';
import { CreateUserUseCase } from '@users/core/use-cases/create-user.use-case';
import { LoginUseCase } from '@users/core/use-cases/login.use-case';
import { UserController } from '@users/infra/controllers/user.controller';

container.registerSingleton<IUserRepositoryPort>('UserRepository', UserRepositoryAdapter);
container.registerSingleton<IEncryptPort>('EncrypterAdapter', EncptyAdapter);
container.registerSingleton<IJwtPort>('JwtAdapter', JwtAdapter);

container.registerSingleton('CreateUserUseCase', CreateUserUseCase);
container.registerSingleton(LoginUseCase);
container.registerSingleton(UserController);

export { container };
