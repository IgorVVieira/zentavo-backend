export const centsToReal = (cents: number): number => {
  if (!cents) {
    return 0;
  }

  /*eslint-disable @typescript-eslint/no-magic-numbers */
  return cents / 100;
};

export const realToCents = (real: number): number => {
  if (!real || isNaN(real)) {
    return 0;
  }

  /*eslint-disable @typescript-eslint/no-magic-numbers */
  return real * 100;
};
