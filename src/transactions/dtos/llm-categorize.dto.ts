export class LlmCategorizeDto {
  userId: string;
  transactions: {
    externalId: string;
    description: string;
  }[];
}

export class LlmCategorizeDtoResponseDto {
  externalId: string;
  categoryId: string;
}
