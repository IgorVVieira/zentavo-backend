/* eslint-disable @typescript-eslint/no-empty-object-type */

import { IBaseRepository } from '@shared/domain/repositories/base.repository.interface';

import { CategoryEntity } from 'transactions/core/domain/entities/category';

export interface ICategoryRepositoryPort extends IBaseRepository<CategoryEntity> {}
