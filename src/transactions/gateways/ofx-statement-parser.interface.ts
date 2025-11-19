import { Statement } from '@transactions/domain/types/statement.type';

export interface IOfxStatementParser {
  parse(ofxData: string): Promise<Statement[]>;
}
