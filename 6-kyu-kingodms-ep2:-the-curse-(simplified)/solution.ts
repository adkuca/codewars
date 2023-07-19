export function translate(speech: string, vocabulary: string[]): string {
  return speech.replaceAll(/[\*\w]+/g, (match) => {
    const pattern = new RegExp(`^${match.replaceAll('*', '\\w')}$`);

    const foundWord = vocabulary.find((word) => pattern.test(word));
    if (!foundWord)
      throw new Error('💥 vocabulary array should contain a searched for word from speech');

    return foundWord;
  });
}
