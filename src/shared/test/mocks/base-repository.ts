export type BaseRepositoryMock = {
  update: jest.Mock;
  delete: jest.Mock;
  find: jest.Mock;
  findAll: jest.Mock;
  create: jest.Mock;
  [key: string]: jest.Mock;
};

export const baseRepository: BaseRepositoryMock = {
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
};
