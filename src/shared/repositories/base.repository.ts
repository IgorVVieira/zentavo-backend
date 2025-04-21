/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly model: any) {}

  async create(data: T): Promise<T> {
    return this.model.create({ data });
  }

  async createMany(data: T[]): Promise<T[]> {
    return this.model.createMany({ data });
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
