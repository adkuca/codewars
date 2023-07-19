export const phone = (phonebookLinesRaw: string, phoneNumber: string): string => {
  const phonebookLinePattern = new RegExp(`(?:\r\n|\r|\n|/).*${phoneNumber}.*(?:\r\n|\r|\n)`, 'g');
  const matchedPhonebookLine = phonebookLinePattern.exec(phonebookLinesRaw);
  if (!matchedPhonebookLine) return `Error => Not found: ${phoneNumber}`;

  const firstPhonebookLineMatch = matchedPhonebookLine[0];

  phonebookLinePattern.lastIndex;
  if (phonebookLinePattern.exec(phonebookLinesRaw))
    return `Error => Too many people: ${phoneNumber}`;

  let phonebookLine = firstPhonebookLineMatch
    .trim()
    .replace(new RegExp(`\\S*${phoneNumber}\\S*`), '');

  const nameRegex = /<(.+?)>/;
  const nameMatch = nameRegex.exec(phonebookLine);
  const name = nameMatch ? nameMatch[1] : null;

  phonebookLine = phonebookLine.replace(nameRegex, '');

  const address = phonebookLine
    .trim()
    .replaceAll(/\s{2,}|_/g, ' ')
    .replaceAll(/[^\w\s-.]*/g, '')
    .trim();
  if (!address.length) throw new Error('no address');

  return `Phone => ${phoneNumber}, Name => ${name}, Address => ${address}`;
};
