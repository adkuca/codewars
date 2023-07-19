function rotate90Clock(squaredString: string, n: number, reverse: boolean = false): string {
  const lines = squaredString.split('\n');
  const rotatedSquaredStrings: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const cI = reverse ? Math.abs(n - i - 1) : i;
    let rotatedLine = '';
    for (let j = 0; j < n; j += 1) {
      const cJ = reverse ? j : Math.abs(n - j - 1);
      rotatedLine += lines[cJ][cI];
    }

    rotatedSquaredStrings.push(rotatedLine);
  }

  return rotatedSquaredStrings.join('\n');
}

export const code = (s: string): string => {
  if (s === '') return '';

  const n = Math.ceil(Math.sqrt(s.length));
  const completeLength = Math.pow(n, 2);
  const completeString = `${s}${String.fromCharCode(11).repeat(completeLength - s.length)}`;

  const squaredString = completeString.match(new RegExp(`.{1,${n}}`, 'g'))?.join('\n');
  if (!squaredString) throw new Error('something exploded');

  return rotate90Clock(squaredString, n);
};

export const decode = (s: string): string => {
  if (s === '') return '';

  const n = s.indexOf('\n');
  if (!n) throw new Error('something exploded');
  const decodedSquaredString = rotate90Clock(s, n, true);

  return decodedSquaredString.replaceAll(new RegExp(`(?:\n|${String.fromCharCode(11)})`, 'g'), '');
};
