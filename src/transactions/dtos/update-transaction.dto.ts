import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsOptional()
  description?: string;
}
