import { IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class ImportTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsObject()
  @IsNotEmpty()
  file: Express.Multer.File;
}
