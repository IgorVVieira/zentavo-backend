export class EntityAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`${name} already exists`);
    this.name = 'EntityAlreadyExistsError';
  }
}
