export function findMissingLetter(letters: string[]): string {
  const sortedletters = [...letters].sort();

  for (let i = 0; i < sortedletters.length - 1; i += 1) {
    if (sortedletters[i]!.charCodeAt(0) + 1 !== sortedletters[i + 1]!.charCodeAt(0)) {
      return String.fromCharCode(sortedletters[i]!.charCodeAt(0) + 1);
    }
  }

  throw new Error('No missing letter found');
}
