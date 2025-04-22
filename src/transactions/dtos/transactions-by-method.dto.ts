import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { TransactionMethod } from '@transactions/domain/entities/transaction.entity';

export class TransactionsByMethodDto {
  @IsEnum(TransactionMethod)
  @IsNotEmpty()
  method: TransactionMethod;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
