import { EntityAlreadyExistsError } from '@shared/errors/entity-already-exists.error';
import { baseRepository, BaseRepositoryMock } from '@shared/test/mocks/base-repository';

import { CreateUserUseCase } from '../../domain/use-cases/create-user.use-case';

describe('CreateUserUseCase', () => {
  type UserRepositoryMock = BaseRepositoryMock & {
    findByEmail: jest.Mock;
  };
  const makeSut = (): { sut: CreateUserUseCase; userRepository: UserRepositoryMock } => {
    const userRepository = {
      ...baseRepository,
      findByEmail: jest.fn(),
    };
    const sut = new CreateUserUseCase(userRepository);

    return { sut, userRepository };
  };

  it('should create a user', async () => {
    const { sut, userRepository } = makeSut();

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

    expect(user).toEqual({
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should not create a user if it already exists', async () => {
    const { sut, userRepository } = makeSut();

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
    } catch (error) {
      expect(error).toBeInstanceOf(EntityAlreadyExistsError);
      expect(error.message).toBe('User already exists');
    }
  });
});
