import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import {
  TransactionMethod,
  TransactionType,
} from '@transactions/domain/entities/transaction.entity';

export class TransactionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsUUID()
  @IsOptional()
  externalId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsEnum(TransactionMethod)
  @IsNotEmpty()
  method: TransactionMethod;

  @IsObject()
  @IsOptional()
  @Expose({ name: 'category' })
  category?: {
    id: string;
    name: string;
    color: string;
  };
}
