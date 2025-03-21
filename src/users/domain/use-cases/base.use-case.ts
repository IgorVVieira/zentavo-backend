export interface IBaseUseCase<T, U> {
  execute(data: T): Promise<U>;
}
