export type BaseRepositoryMock = {
  create: jest.Mock;
  createMany: jest.Mock;
  findAll: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  findOne: jest.Mock;
  [key: string]: jest.Mock;
};

export const baseRepository: BaseRepositoryMock = {
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
};
