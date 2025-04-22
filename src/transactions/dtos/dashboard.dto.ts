import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { TransactionMethod } from '@transactions/domain/entities/transaction.entity';

export class TransactionsByMethodDto {
  @IsEnum(TransactionMethod)
  @IsNotEmpty()
  method: TransactionMethod;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class TransactionsByCategoryDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  percentage: number;
}
