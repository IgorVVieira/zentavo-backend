import { Statement } from '@transactions/domain/types/statement.type';

export interface ICsvStatementParser {
  parse(file: Express.Multer.File): Promise<Statement[]>;
}
