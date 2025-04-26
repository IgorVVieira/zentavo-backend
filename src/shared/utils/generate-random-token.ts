export const generateSixDigitToken = (): string => {
  const initial = 100000;
  const final = 900000;
  const token = Math.floor(initial + Math.random() * final);

  return token.toString();
};
