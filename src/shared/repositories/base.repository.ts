/* eslint-disable @typescript-eslint/no-explicit-any*/

import { PrismaClient } from '@prisma/client';

import { EntityName } from '@shared/domain/entities/entity-name.enum';
import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

export class BaseRepository<T extends Record<string, any>, R = T> implements IBaseRepository<T> {
  protected readonly prisma: PrismaClient;

  constructor(protected readonly entityName: EntityName) {
    this.prisma = new PrismaClient();
  }

  async create(data: T): Promise<T> {
    const result = (await this.prisma[this.entityName].create({ data: data as any })) as R;

    return result as unknown as T;
  }

  async update(data: T & { id: string }): Promise<T> {
    const { id, ...updateData } = data;
    const result = (await this.prisma[this.entityName].update({
      where: { id },
      data: updateData,
    })) as R;

    return result as unknown as T;
  }

  async delete(id: string): Promise<void> {
    await this.prisma[this.entityName].delete({
      where: { id },
    });
  }

  async find(id: string): Promise<T | null> {
    const result = (await this.prisma[this.entityName].findUnique({
      where: { id },
    })) as R | null;

    return result as unknown as T | null;
  }

  async findAll(): Promise<T[]> {
    const results = (await this.prisma[this.entityName].findMany()) as R[];

    return results as unknown as T[];
  }
}
