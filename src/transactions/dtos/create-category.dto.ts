import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { TransactionType } from '@transactions/domain/entities/transaction.entity';

export class CreateCategoryDto {
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType | null;
}
