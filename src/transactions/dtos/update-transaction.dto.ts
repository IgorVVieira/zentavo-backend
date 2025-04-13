import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  userId: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsOptional()
  description?: string;
}
