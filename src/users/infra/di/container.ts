import { container } from 'tsyringe';

import { EncptyAdapter } from '@users/adapters/gateways/encypt.adapter';
import { JwtAdapter } from '@users/adapters/gateways/jwt.adapter';
import { UserRepositoryAdapter } from '@users/adapters/repositories/user.repository.adapter';
import { UserValidatorAdapterService } from '@users/adapters/services/user-validator.adapter.service';
import { AuthController } from '@users/controllers/auth.controller';
import { UserController } from '@users/controllers/user.controller';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { IEncryptPort } from '@users/gateways/encypt.port';
import { IJwtPort } from '@users/gateways/jwt.port';
import { IUserValidatorPort } from '@users/services/user-validator.port';
import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { GetMeUseCase } from '@users/use-cases/get-me/get-me.use-case';
import { LoginUseCase } from '@users/use-cases/login/login.use-case';

container.registerSingleton<IUserRepositoryPort>('UserRepository', UserRepositoryAdapter);
container.registerSingleton<IEncryptPort>('EncrypterAdapter', EncptyAdapter);
container.registerSingleton<IJwtPort>('JwtAdapter', JwtAdapter);

container.registerSingleton<IUserValidatorPort>('UserValidator', UserValidatorAdapterService);

container.registerSingleton('CreateUserUseCase', CreateUserUseCase);
container.registerSingleton('LoginUseCase', LoginUseCase);
container.registerSingleton('GetMeUseCase', GetMeUseCase);
container.registerSingleton(UserController);
container.registerSingleton(AuthController);

export { container };
