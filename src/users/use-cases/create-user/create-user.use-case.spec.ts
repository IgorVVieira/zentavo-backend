import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';
import { baseRepository, BaseRepositoryMock } from '@shared/test/mocks/base-repository';

import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  type UserRepositoryMock = BaseRepositoryMock & {
    findByEmail: jest.Mock;
  };

  type SutTypes = {
    sut: CreateUserUseCase;
    userRepository: UserRepositoryMock;
    encypterMock: {
      encrypt: jest.Mock;
      compare: jest.Mock;
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
    const sut = new CreateUserUseCase(userRepository, encypterMock);

    return { sut, userRepository, encypterMock };
  };

  it('should create a user', async () => {
    const { sut, userRepository, encypterMock } = makeSut();

    encypterMock.encrypt.mockResolvedValue('any_password_encrypted');
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const user = await sut.execute({
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
    });

    expect(encypterMock.encrypt).toHaveBeenCalledWith('any_password');
    expect(userRepository.findByEmail).toHaveBeenCalledWith('any_email');
    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'any_email',
      password: 'any_password_encrypted',
      name: 'any_name',
    });

    expect(user).toEqual({
      id: 'any_id',
      email: 'any_email',
      name: 'any_name',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should not create a user if it already exists', async () => {
    const { sut, userRepository, encypterMock } = makeSut();

    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await sut.execute({
        email: 'any_email',
        password: 'any_password',
        name: 'any_name',
      });

      expect(encypterMock.encrypt).not.toHaveBeenCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(EntityAlreadyExistsError);
      expect(error.message).toBe('User already exists');
    }
  });
});
