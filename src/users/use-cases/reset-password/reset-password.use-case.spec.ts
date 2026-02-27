import { baseRepository, BaseRepositoryMock } from '@shared/test/mocks/base-repository';

import { VerificationTokenType } from '@users/domain/entities/verification-token.entity';
import { ResetPasswordUseCase } from '@users/use-cases/reset-password/reset-password.use-case';
import { ValidateTokenUseCase } from '@users/use-cases/validate-token/validate-token.use-case';

describe('ResetPasswordUseCase', () => {
  type UserRepositoryMock = BaseRepositoryMock & {
    findByEmail: jest.Mock;
    updatePassword: jest.Mock;
  };

  type VerificationTokenRepositoryMock = BaseRepositoryMock & {
    findByUserId: jest.Mock;
    findByToken: jest.Mock;
    updateUsedStatus: jest.Mock;
  };

  type SutTypes = {
    sut: ResetPasswordUseCase;
    validateTokenUseCase: jest.Mocked<ValidateTokenUseCase>;
    userRepository: UserRepositoryMock;
    verificationTokenRepository: VerificationTokenRepositoryMock;
    encryptPort: { encrypt: jest.Mock; compare: jest.Mock };
  };

  const makeSut = (): SutTypes => {
    const validateTokenUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ValidateTokenUseCase>;

    const userRepository: UserRepositoryMock = {
      ...baseRepository,
      findByEmail: jest.fn(),
      updatePassword: jest.fn(),
    };

    const verificationTokenRepository: VerificationTokenRepositoryMock = {
      ...baseRepository,
      findByUserId: jest.fn(),
      findByToken: jest.fn(),
      updateUsedStatus: jest.fn(),
    };

    const encryptPort = {
      encrypt: jest.fn(),
      compare: jest.fn(),
    };

    const sut = new ResetPasswordUseCase(
      validateTokenUseCase,
      userRepository,
      verificationTokenRepository,
      encryptPort,
    );

    return { sut, validateTokenUseCase, userRepository, verificationTokenRepository, encryptPort };
  };

  const validInput = {
    token: '123456',
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    newPassword: 'NewPass1',
  };

  it('should reset password successfully', async () => {
    const { sut, validateTokenUseCase, userRepository, verificationTokenRepository, encryptPort } =
      makeSut();

    validateTokenUseCase.execute.mockResolvedValue({
      isValid: true,
      userId: validInput.userId,
      tokenId: 'token-id-uuid',
    });
    encryptPort.encrypt.mockResolvedValue('hashed_password');
    userRepository.updatePassword.mockResolvedValue(undefined);
    verificationTokenRepository.updateUsedStatus.mockResolvedValue(undefined);

    await sut.execute(validInput);

    expect(validateTokenUseCase.execute).toHaveBeenCalledWith({
      token: validInput.token,
      userId: validInput.userId,
      type: VerificationTokenType.PASSWORD_RESET,
    });
    expect(encryptPort.encrypt).toHaveBeenCalledWith(validInput.newPassword);
    expect(userRepository.updatePassword).toHaveBeenCalledWith(
      validInput.userId,
      'hashed_password',
    );
    expect(verificationTokenRepository.updateUsedStatus).toHaveBeenCalledWith('token-id-uuid');
  });

  it('should throw UnauthorizedError when token is invalid', async () => {
    const { sut, validateTokenUseCase } = makeSut();

    validateTokenUseCase.execute.mockResolvedValue({ isValid: false });

    await expect(sut.execute(validInput)).rejects.toThrow('Invalid or expired token');
  });

  it('should throw UnauthorizedError when token is expired', async () => {
    const { sut, validateTokenUseCase } = makeSut();

    validateTokenUseCase.execute.mockResolvedValue({ isValid: false });

    await expect(sut.execute(validInput)).rejects.toThrow('Invalid or expired token');
  });

  it('should not update password when token validation fails', async () => {
    const { sut, validateTokenUseCase, userRepository } = makeSut();

    validateTokenUseCase.execute.mockResolvedValue({ isValid: false });

    await expect(sut.execute(validInput)).rejects.toThrow();

    expect(userRepository.updatePassword).not.toHaveBeenCalled();
  });

  it('should not mark token as used when password update fails', async () => {
    const { sut, validateTokenUseCase, userRepository, verificationTokenRepository, encryptPort } =
      makeSut();

    validateTokenUseCase.execute.mockResolvedValue({
      isValid: true,
      userId: validInput.userId,
      tokenId: 'token-id-uuid',
    });
    encryptPort.encrypt.mockResolvedValue('hashed_password');
    userRepository.updatePassword.mockRejectedValue(new Error('DB error'));

    await expect(sut.execute(validInput)).rejects.toThrow('DB error');

    expect(verificationTokenRepository.updateUsedStatus).not.toHaveBeenCalled();
  });
});
