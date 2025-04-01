import { EntityNotFoundError } from '@shared/errors/entity-not-found.error';
import { baseRepository, BaseRepositoryMock } from '@shared/test/mocks/base-repository';

import { GetMeUseCase } from '@users/use-cases/get-me.use-case';

describe('GetMeUseCase', () => {
  type UserRepositoryMock = BaseRepositoryMock & {
    findByEmail: jest.Mock;
  };

  type SutTypes = {
    sut: GetMeUseCase;
    userRepository: UserRepositoryMock;
  };

  const makeSut = (): SutTypes => {
    const userRepository = {
      ...baseRepository,
      findByEmail: jest.fn(),
    };

    const sut = new GetMeUseCase(userRepository);

    return { sut, userRepository };
  };

  it('should return a user', async () => {
    const { sut, userRepository } = makeSut();

    userRepository.findOne.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      name: 'any_name',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await sut.execute('any_id');

    expect(userRepository.findOne).toHaveBeenCalledWith('any_id');
    expect(user).toEqual({
      id: 'any_id',
      email: 'any_email',
      name: 'any_name',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw an error if user not found', async () => {
    const { sut, userRepository } = makeSut();

    userRepository.findOne.mockResolvedValue(null);

    await expect(sut.execute('any_id')).rejects.toThrow(new EntityNotFoundError('User'));
  });
});
