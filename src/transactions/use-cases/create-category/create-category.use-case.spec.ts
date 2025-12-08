import { baseRepository, BaseRepositoryMock } from '@shared/test/mocks/base-repository';

import { TransactionType } from '@transactions/domain/entities/transaction.entity';
import { CreateCategoryUseCase } from '@transactions/use-cases/create-category/create-category.use-case';

describe('CreateCategoryUseCase', () => {
  type SutTypes = {
    sut: CreateCategoryUseCase;
    categoryRepositoryMock: BaseRepositoryMock & {
      findByNameAndUserId: jest.Mock;
      findByUserId: jest.Mock;
    };
    userValidatorMock: {
      validateUserExists: jest.Mock;
    };
  };

  const makeSut = (): SutTypes => {
    const categoryRepositoryMock = {
      ...baseRepository,
      findByNameAndUserId: jest.fn(),
      findByUserId: jest.fn(),
    };

    const userValidatorMock = {
      validateUserExists: jest.fn(),
    };

    const sut = new CreateCategoryUseCase(categoryRepositoryMock, userValidatorMock);

    return { sut, categoryRepositoryMock, userValidatorMock };
  };

  it('should create a category', async () => {
    const { sut, categoryRepositoryMock } = makeSut();

    categoryRepositoryMock.create.mockResolvedValue({
      id: 'any_id',
      userId: 'any_user_id',
      name: 'any_name',
      color: 'any_color',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await sut.execute({
      userId: 'any_user_id',
      name: 'any_name',
      color: 'any_color',
      type: TransactionType.CASH_IN,
    });

    expect(categoryRepositoryMock.create).toHaveBeenCalledWith({
      userId: 'any_user_id',
      name: 'any_name',
      color: 'any_color',
      type: TransactionType.CASH_IN,
    });

    expect(result).toEqual({
      id: 'any_id',
      userId: 'any_user_id',
      name: 'any_name',
      color: 'any_color',
      type: TransactionType.CASH_IN,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw if category already exists', async () => {
    const { sut, categoryRepositoryMock } = makeSut();

    categoryRepositoryMock.findByNameAndUserId.mockResolvedValueOnce({
      id: 'any_id',
      userId: 'any_user_id',
      name: 'any_name',
      color: 'any_color',
      type: TransactionType.CASH_OUT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await sut.execute({
        userId: 'any_user_id',
        name: 'any_name',
        color: 'any_color',
        type: TransactionType.CASH_OUT,
      });
    } catch (error) {
      expect(error.message).toEqual('Category already exists');
      expect(error.name).toEqual('EntityAlreadyExistsError');
    }
  });
});
