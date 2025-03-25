import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

import { IJwtPort } from 'users/core/gateways/jwt.port';

@injectable()
export class JwtAdapter implements IJwtPort {
  public sign(id: string, name: string, email: string): string {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }

  public async verify(token: string): Promise<unknown> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      throw new Error('Invalid token');
    }
  }
}
