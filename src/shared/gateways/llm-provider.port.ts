export interface ILlmProvider {
  execute<T>(prompt: string): Promise<T>;
}
