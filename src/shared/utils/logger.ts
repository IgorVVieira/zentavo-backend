import pino from 'pino';

export class Logger {
  static info(message: string): void {
    pino().info(message);
  }

  static error(message: string, error?: Error): void {
    pino().error(`${message}: ${error?.message}`);
  }

  static warn(message: string): void {
    pino().warn(message);
  }

  static debug(message: string): void {
    pino().debug(message);
  }
}
