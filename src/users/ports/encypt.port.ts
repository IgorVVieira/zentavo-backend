export interface IEncryptPort {
  encrypt(plainText: string): Promise<string>;
  compare(plainText: string, hashedText: string): Promise<boolean>;
}
