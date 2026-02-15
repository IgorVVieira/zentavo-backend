export const centsToReal = (cents: number): number => {
  if (!cents) {
    return 0;
  }

  /*eslint-disable @typescript-eslint/no-magic-numbers */
  return cents / 100;
};
