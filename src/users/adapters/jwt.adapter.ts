import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { JwtDto } from '@users/dtos/jwt.dto';
import { IJwtPort } from '@users/ports/jwt.port';

@injectable()
export class JwtAdapter implements IJwtPort {
  sign(data: JwtDto): string {
    const { id, name, email } = data;

    return jwt.sign({ id, name, email }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }

  async verify(token: string): Promise<unknown> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      throw new Error('Invalid token');
    }
  }
}
