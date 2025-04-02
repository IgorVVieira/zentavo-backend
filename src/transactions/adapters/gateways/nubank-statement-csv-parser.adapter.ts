import * as csv from 'fast-csv';
import { injectable } from 'tsyringe';

import {
  TransactionMethod,
  TransactionType,
} from '@transactions/domain/entities/transaction.entity';
import { Statement } from '@transactions/domain/types/statement.type';
import { ICsvStatementParser } from '@transactions/gateways/csv-statement-parser.interface';

@injectable()
export class NubankStatementCsvParser implements ICsvStatementParser {
  public async parse(file: Express.Multer.File): Promise<Statement[]> {
    const data = file.buffer.toString('utf-8');

    try {
      const results: Statement[] = await new Promise<Statement[]>((resolve, reject) => {
        const rows: Statement[] = [];

        csv
          .parseString(data, {
            headers: true,
            trim: true,
            ignoreEmpty: true,
          })
          .on('data', row => {
            const amount = Number(row['Valor']);
            const statement: Statement = {
              externalId: row['Identificador'],
              date: new Date(row['Data']),
              description: row['Descrição'],
              amount: +amount,
              type: amount > 0 ? TransactionType.CASH_IN : TransactionType.CASH_OUT,
              method: this.getMethod(row['Descrição']),
            };

            rows.push(statement);
          })
          .on('error', error => {
            console.error('Error parsing CSV:', error);
            reject(error);
          })
          .end(() => {
            resolve(rows);
          });
      });

      return results;
    } catch (error) {
      console.error('Error processing CSV file:', error);
      throw new Error('Error processing CSV file');
    }
  }

  private getMethod(description: string): TransactionMethod {
    const lowerDescription = description.toLowerCase();

    if (lowerDescription.includes('pix')) {
      return TransactionMethod.PIX;
    }
    if (lowerDescription.includes('débito')) {
      return TransactionMethod.DEBIT;
    }
    if (lowerDescription.includes('Pagamento de fatura')) {
      return TransactionMethod.CARD_PAYMENT;
    }

    return TransactionMethod.DEBIT;
  }
}
