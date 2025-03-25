import bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';

import { IEncryptPort } from 'users/core/gateways/encypt.port';

@injectable()
export class EncptyAdapter implements IEncryptPort {
  private readonly saltRounds = 10;

  public async encrypt(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  public async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
