import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsUUID } from 'class-validator';

import { TransactionType } from '@transactions/domain/entities/transaction.entity';

export class ListByCategoryQueryDto {
  @IsNumberString()
  @IsNotEmpty()
  month: string;

  @IsNumberString()
  @IsNotEmpty()
  year: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;
}

export class GetTransactionsDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType?: TransactionType;
}
