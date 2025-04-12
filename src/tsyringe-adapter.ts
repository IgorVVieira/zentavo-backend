/* eslint-disable @typescript-eslint/no-explicit-any */
import { IocAdapter } from 'routing-controllers';
import { container } from 'tsyringe';

export const TsyringeAdapter: IocAdapter = {
  get<T>(someClass: new (...args: any[]) => T): T {
    return container.resolve<T>(someClass);
  },
};
