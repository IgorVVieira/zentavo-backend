import * as csv from 'fast-csv';
import { injectable } from 'tsyringe';

import { HttpStatus } from '@shared/http-status.enum';

import { Request, Response } from 'express';

@injectable()
export class TransactionController {
  public async importData(req: Request, resp: Response): Promise<void> {
    const file = req.file;

    if (!file) {
      const error = 400;

      resp.status(error).send('No file uploaded');

      return;
    }

    const data = file.buffer.toString('utf-8');

    try {
      // Usando uma Promise para aguardar o término do processamento do CSV
      const parsedData = await new Promise<object[]>((resolve, reject) => {
        const results: object[] = [];

        csv
          .parseString(data, {
            headers: true,
            trim: true, // Remove espaços em branco extras
            ignoreEmpty: true, // Ignora linhas vazias
          })
          .on('data', row => {
            results.push(row);
          })
          .on('error', error => {
            reject(error);
          })
          .on('end', (rowCount: number) => {
            console.log(`CSV file successfully processed. Found ${rowCount} rows.`);
            resolve(results);
          });
      });

      // Agora podemos enviar a resposta com os dados processados
      resp.status(HttpStatus.OK).json({
        message: 'File imported successfully',
        data: parsedData,
        rowCount: parsedData.length,
      });
    } catch (error) {
      console.error('Error processing CSV file:', error);
      resp.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error processing CSV file',
        error: error.message,
      });
    }
  }
}
