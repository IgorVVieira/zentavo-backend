export class UpdateTransactionDto {
  id: string;
  userId: string;
  categoryId?: string | null;
  description?: string;
}
