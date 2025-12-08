import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { TransactionType } from '@transactions/domain/entities/transaction.entity';

export class UpdateCategoryDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type: TransactionType;
}
