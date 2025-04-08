export interface IUserValidatorPort {
  validateUserExists(userId: string): Promise<void>;
}
