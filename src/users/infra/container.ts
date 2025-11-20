import { container } from 'tsyringe';

import { NodemailerEmailProvider } from '@shared/adapters/nodemailer-provider.adapter';
import { IEmailProviderPort } from '@shared/gateways/email-provider.port';
import { Injections } from '@shared/types/injections';

import { EncptyAdapter } from '@users/adapters/gateways/encypt.adapter';
import { JwtAdapter } from '@users/adapters/gateways/jwt.adapter';
import { UserRepositoryAdapter } from '@users/adapters/repositories/user.repository.adapter';
import { VerificationTokenRepositoryAdapter } from '@users/adapters/repositories/verification-token.adapter';
import { UserValidatorAdapterService } from '@users/adapters/services/user-validator.adapter.service';
import { AuthController } from '@users/controllers/auth.controller';
import { UserController } from '@users/controllers/user.controller';
import { IUserRepositoryPort } from '@users/domain/repositories/user.repository.port';
import { IVerificationTokenRepositoryPort } from '@users/domain/repositories/verification-token.repository.port';
import { IEncryptPort } from '@users/gateways/encypt.port';
import { IJwtPort } from '@users/gateways/jwt.port';
import { IUserValidatorPort } from '@users/services/user-validator.port';
import { CreateUserUseCase } from '@users/use-cases/create-user/create-user.use-case';
import { GetMeUseCase } from '@users/use-cases/get-me/get-me.use-case';
import { LoginUseCase } from '@users/use-cases/login/login.use-case';
import { SendRecoveryPasswordTokenUseCase } from '@users/use-cases/send-recovery-password-token/send-recovery-password.use-case';
import { ValidateTokenUseCase } from '@users/use-cases/validate-token/validate-token.use-case';

container.registerSingleton<IUserRepositoryPort>(Injections.USER_REPOSITORY, UserRepositoryAdapter);
container.registerSingleton<IVerificationTokenRepositoryPort>(
  Injections.VERIFICATION_TOKEN_REPOSITORY,
  VerificationTokenRepositoryAdapter,
);
container.registerSingleton<IEncryptPort>(Injections.ENCRYPT_PORT, EncptyAdapter);
container.registerSingleton<IJwtPort>(Injections.JWT_PORT, JwtAdapter);
container.registerSingleton<IEmailProviderPort>(Injections.EMAIL_PROVIDER, NodemailerEmailProvider);

container.registerSingleton<IUserValidatorPort>(
  Injections.USER_VALIDATOR,
  UserValidatorAdapterService,
);

container.registerSingleton(Injections.CREATE_USER_USE_CASE, CreateUserUseCase);
container.registerSingleton(Injections.LOGIN_USE_CASE, LoginUseCase);
container.registerSingleton(Injections.GET_ME_USE_CASE, GetMeUseCase);
container.registerSingleton(
  Injections.SEND_RECOVERY_PASSWORD_TOKEN_USE_CASE,
  SendRecoveryPasswordTokenUseCase,
);
container.registerSingleton(Injections.VALIDATE_TOKEN_USE_CASE, ValidateTokenUseCase);

container.registerSingleton(Injections.USER_CONTROLLER, UserController);
container.registerSingleton(Injections.AUTH_CONTROLLER, AuthController);

export { container };
