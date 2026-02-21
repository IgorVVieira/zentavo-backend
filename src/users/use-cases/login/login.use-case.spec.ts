import { baseRepository, BaseRepositoryMock } from '@shared/test/mocks/base-repository';

import { UserStatus } from '@users/domain/entities/user.entity';
import { LoginUseCase } from '@users/use-cases/login/login.use-case';

describe('LoginUseCase', () => {
  type UserRepositoryMock = BaseRepositoryMock & {
    findByEmail: jest.Mock;
  };

  type SutTypes = {
    sut: LoginUseCase;
    userRepository: UserRepositoryMock;
    encypterMock: {
      encrypt: jest.Mock;
      compare: jest.Mock;
    };
    jwtMock: {
      sign: jest.Mock;
      verify: jest.Mock;
    };
  };

  const makeSut = (): SutTypes => {
    const userRepository = {
      ...baseRepository,
      findByEmail: jest.fn(),
    };

    const encypterMock = {
      encrypt: jest.fn(),
      compare: jest.fn(),
    };

    const jwtMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const subscriptionRepository = {
      ...baseRepository,
      hasSubscriptionActive: jest.fn(),
      findByPaymentId: jest.fn(),
      listUserSubscriptions: jest.fn(),
    };

    const sut = new LoginUseCase(userRepository, encypterMock, jwtMock, subscriptionRepository);

    return { sut, userRepository, encypterMock, jwtMock };
  };

  it.skip('should login a user', async () => {
    const { sut, userRepository, encypterMock, jwtMock } = makeSut();

    encypterMock.compare.mockResolvedValue(true);
    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      status: UserStatus.ACTIVE,
    });
    jwtMock.sign.mockReturnValue('any_token');
    const user = await sut.execute({
      email: 'any_email',
      password: 'any_password',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('any_email');
    expect(encypterMock.compare).toHaveBeenCalledWith('any_password', 'any_password');
    expect(jwtMock.sign).toHaveBeenCalledWith('any_id', 'any_name', 'any_email');
    expect(user).toEqual({
      token: 'any_token',
    });
  });

  it('should throw an error when user not found', async () => {
    const { sut, userRepository } = makeSut();

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(sut.execute({ email: 'any_email', password: 'any_password' })).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw an error when password is invalid', async () => {
    const { sut, userRepository, encypterMock } = makeSut();

    encypterMock.compare.mockResolvedValue(false);
    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(sut.execute({ email: 'any_email', password: 'any_password' })).rejects.toThrow(
      'Invalid password',
    );
  });

  it('should throw an error when jwt sign fails', async () => {
    const { sut, userRepository, encypterMock, jwtMock } = makeSut();

    encypterMock.compare.mockResolvedValue(true);
    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jwtMock.sign.mockImplementation(() => {
      throw new Error();
    });

    await expect(sut.execute({ email: 'any_email', password: 'any_password' })).rejects.toThrow();
  });

  it('should throw an error when user is not active', async () => {
    const { sut, userRepository, encypterMock } = makeSut();

    encypterMock.compare.mockResolvedValue(true);
    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      status: UserStatus.PEDING_VERIFICATION,
    });

    await expect(sut.execute({ email: 'any_email', password: 'any_password' })).rejects.toThrow(
      'User is not active',
    );
  });
});
