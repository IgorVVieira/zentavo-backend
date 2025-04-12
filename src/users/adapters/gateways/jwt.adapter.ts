import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { IJwtPort } from '@users/gateways/jwt.port';

@injectable()
export class JwtAdapter implements IJwtPort {
  sign(id: string, name: string, email: string): string {
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
