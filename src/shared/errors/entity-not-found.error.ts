export class EntityNotFoundError extends Error {
  constructor(name: string) {
    super(`${name} not found`);
    this.name = 'EntityNotFoundError';
  }
}
