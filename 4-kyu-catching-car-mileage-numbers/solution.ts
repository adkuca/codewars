const isDigitFollowedByZeros = (n: number): boolean => {
  if (n < 10) return false;

  const exponent = Math.floor(Math.log10(n));
  const leadingDigit = Math.floor(n / Math.pow(10, exponent));
  return leadingDigit * Math.pow(10, exponent) === n;
};

const isSameDigitNumber = (n: number): boolean => {
  if (n < 10) return true;

  const lastDigit = n % 10;
  let tempN = n;

  while (tempN) {
    if (tempN % 10 !== lastDigit) return false;
    tempN = Math.floor(tempN / 10);
  }

  return true;
};

const getNextIncrementalDigit = (n: number): number => (n + 1) % 10;

const getNextDecrementalDigit = (n: number): number => (n + 9) % 10;

const isSequentiallyIncrementingNumber = (n: number): boolean => {
  if (Math.abs(n) < 10) return false;

  let rightDigit = n % 10;
  let tempN = Math.floor(n / 10);

  while (tempN > 0) {
    const leftDigit = tempN % 10;
    if (leftDigit === 0) return false;
    if (getNextIncrementalDigit(leftDigit) !== rightDigit) return false;

    rightDigit = leftDigit;
    tempN = Math.floor(tempN / 10);
  }

  return true;
};

const isSequentiallyDecrementingNumber = (n: number): boolean => {
  if (Math.abs(n) < 10) return false;

  let rightDigit = n % 10;
  let tempN = Math.floor(n / 10);

  while (tempN > 0) {
    const leftDigit = tempN % 10;
    if (leftDigit === 0) return false;
    if (getNextDecrementalDigit(leftDigit) !== rightDigit) return false;

    rightDigit = leftDigit;
    tempN = Math.floor(tempN / 10);
  }

  return true;
};

const isPalindrome = (n: number): boolean => {
  if (n < 0 || (n % 10 === 0 && n !== 0)) return false;
  if (n < 10) return true;

  let remainingDigits = n;
  let halfReversed = 0;

  while (remainingDigits > halfReversed) {
    halfReversed = halfReversed * 10 + (remainingDigits % 10);
    remainingDigits = Math.floor(remainingDigits / 10);
  }

  return remainingDigits === halfReversed || remainingDigits === Math.floor(halfReversed / 10);
};

const isInterestingNumber = (n: number, awesomePhrases: number[]): boolean => {
  if (n < 100) return false;

  return (
    awesomePhrases.includes(n) ||
    isDigitFollowedByZeros(n) ||
    isSameDigitNumber(n) ||
    isSequentiallyIncrementingNumber(n) ||
    isSequentiallyDecrementingNumber(n) ||
    isPalindrome(n)
  );
};

export function isInteresting(n: number, awesomePhrases: number[]): 0 | 1 | 2 {
  if (isInterestingNumber(n, awesomePhrases)) return 2;

  for (let offset = 1; offset <= 2; offset += 1) {
    if (isInterestingNumber(n + offset, awesomePhrases)) return 1;
  }

  return 0;
}
