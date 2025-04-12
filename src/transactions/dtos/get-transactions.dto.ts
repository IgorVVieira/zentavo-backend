import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

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
}
