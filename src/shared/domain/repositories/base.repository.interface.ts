export interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  find(id: string): Promise<T>;
  findAll(): Promise<T[]>;
}
