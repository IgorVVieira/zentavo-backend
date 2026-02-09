export interface IJwtPort {
  sign(id: string, name: string, email: string): string;
  verify(token: string): Promise<unknown>;
}
