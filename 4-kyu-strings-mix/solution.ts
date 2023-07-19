export const mix = (s1: string, s2: string): string => {
  const s1LetterOccurrenceMap = createLetterOccurrenceMap(getLowercaseAlphabet(s1) || '');
  const s2LetterOccurrenceMap = createLetterOccurrenceMap(getLowercaseAlphabet(s2) || '');

  const r = new Map<string, { stringLabel: string; amount: number }>();
  s1LetterOccurrenceMap.forEach((value, key) => {
    if (value === 1) return;
    if (r.has(key)) {
      const rValue = r.get(key)!;
      if (rValue.amount === value) r.set(key, { stringLabel: '=', amount: rValue.amount });
      else if (rValue.amount < value) r.set(key, { stringLabel: '1', amount: value });
    } else r.set(key, { stringLabel: '1', amount: value });
  });
  s2LetterOccurrenceMap.forEach((value, key) => {
    if (value === 1) return;
    if (r.has(key)) {
      const rValue = r.get(key)!;
      if (rValue.amount === value) r.set(key, { stringLabel: '=', amount: rValue.amount });
      else if (rValue.amount < value) r.set(key, { stringLabel: '2', amount: value });
    } else r.set(key, { stringLabel: '2', amount: value });
  });

  return [...r]
    .sort(sortF)
    .map((val) => `${val[1].stringLabel}:${val[0].toString().repeat(val[1].amount)}`)
    .join('/');
};

function sortF(
  a: [string, { stringLabel: string; amount: number }],
  b: [string, { stringLabel: string; amount: number }]
) {
  // console.log(a[1].amount, b[1].amount, a[1].amount < b[1].amount)
  if (a[1].amount > b[1].amount) return -1;
  else if (a[1].amount === b[1].amount) {
    // console.log(a[1].stringLabel, b[1].stringLabel, a[1].stringLabel < b[1].stringLabel)
    if (a[1].stringLabel < b[1].stringLabel) return -1;
    else if (a[1].stringLabel === b[1].stringLabel) if (a[0] < b[0]) return -1;
  }

  return 0;
}

function createLetterOccurrenceMap(str: string): Map<string, number> {
  const letterOccurrenceMap = new Map<string, number>();

  for (let i = 0; i < str.length; i++) {
    const letter = str.charAt(i);
    letterOccurrenceMap.set(
      letter,
      letterOccurrenceMap.has(letter) ? (letterOccurrenceMap.get(letter) || 0) + 1 : 1
    );
  }

  return letterOccurrenceMap;
}

function getLowercaseAlphabet(str: string) {
  return str.match(/[a-z]/g)?.join('').toLowerCase();
}
