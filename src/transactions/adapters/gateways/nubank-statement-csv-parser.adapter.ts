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
  async parse(file: Express.Multer.File): Promise<Statement[]> {
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
            if (row['Descrição'] === 'Aplicação RDB') {
              // Skip rows with 'Aplicação RDB' description
              return;
            }

            const amount = Number(row['Valor']);
            const statement: Statement = {
              externalId: row['Identificador'],
              date: this.parseDate(row['Data']),
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
          .on('end', () => {
            resolve(rows);
          });
      });

      return results;
    } catch (error) {
      console.error('Error processing CSV file:', error);
      throw new Error('Error processing CSV file');
    }
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);

    return new Date(year, month - 1, day);
  }

  private getMethod(description: string): TransactionMethod {
    const lowerDescription = description.toLowerCase();

    const patterns: [string | RegExp, TransactionMethod][] = [
      [/pix/, TransactionMethod.PIX],
      [/d[ée]bito/, TransactionMethod.DEBIT],
      [/pagamento\s+de\s+fatura/, TransactionMethod.CARD_PAYMENT],
      [/transfer[eê]ncia\s+recebida/, TransactionMethod.PIX],
    ];

    for (const [pattern, method] of patterns) {
      if (
        typeof pattern === 'string'
          ? lowerDescription.includes(pattern)
          : pattern.test(lowerDescription)
      ) {
        return method;
      }
    }

    return TransactionMethod.DEBIT;
  }
}
