import { randomInt } from 'crypto';

/*eslint-disable @typescript-eslint/no-magic-numbers */
export const generateSixDigitToken = (): string => randomInt(100000, 1000000).toString();
