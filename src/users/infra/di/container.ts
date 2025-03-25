import { container } from 'tsyringe';

import { EncptyAdapter } from 'users/adapters/gateways/encypt.adapter';
import { JwtAdapter } from 'users/adapters/gateways/jwt.adapter';
import { IEncryptPort } from 'users/core/gateways/encypt.port';
import { IJwtPort } from 'users/core/gateways/jwt.port';
import { CreateUserUseCase } from 'users/core/use-cases/create-user.use-case';
import { LoginUseCase } from 'users/core/use-cases/login.use-case';

container.registerSingleton<IEncryptPort>('EncrypterAdapter', EncptyAdapter);
container.registerSingleton<IJwtPort>('JwtAdapter', JwtAdapter);

container.registerSingleton(CreateUserUseCase);
container.registerSingleton(LoginUseCase);
