interface Letter {
  value: string;
  visited: boolean;
  position: [number, number];
}

export function survivors(arr: string[]): string {
  const groupsOfAdjecentLetters: Letter[][] = createGroupsOfAdjecentLetters(arr);

  if (groupsOfAdjecentLetters.length === 1)
    return groupsOfAdjecentLetters[0].reduce((str, letter) => (str += letter.value), '');

  const lettersMap: Letter[][] = createLettersMap(arr);
  groupsOfAdjecentLetters.forEach((primaryGroup) => {
    primaryGroup.forEach((primaryLetter) => {
      groupsOfAdjecentLetters.forEach((secondaryGroup) => {
        if (primaryGroup === secondaryGroup) return;
        secondaryGroup.forEach((secondaryLetter) => {
          if (
            isWithinRadius(primaryLetter.position, secondaryLetter.position, primaryGroup.length)
          ) {
            lettersMap[secondaryLetter.position[0]][secondaryLetter.position[1]].visited = true;
          }
        });
      });
    });
  });

  const result = lettersMap.reduce(
    (survived, row) =>
      (survived += row.reduce(
        (rowSurvived, letter) =>
          (rowSurvived += letter.value !== ' ' && !letter.visited ? letter.value : ''),
        ''
      )),
    ''
  );

  return result;
}

function isWithinRadius(
  primaryPosition: [number, number],
  secondaryPosition: [number, number],
  radius: number
): boolean {
  if (
    Math.abs(primaryPosition[0] - secondaryPosition[0]) <= radius &&
    Math.abs(primaryPosition[1] - secondaryPosition[1]) <= radius
  )
    return true;
  return false;
}

function createLettersMap(arr: string[]): Letter[][] {
  return arr.reduce((lettersMap, str, rowIndex) => {
    const letters: Letter[] = str
      .split('')
      .map((char, colIndex) => ({ value: char, visited: false, position: [rowIndex, colIndex] }));
    lettersMap.push(letters);
    return lettersMap;
  }, [] as Letter[][]);
}

function createGroupsOfAdjecentLetters(strings: string[]): Letter[][] {
  const lettersMap: Letter[][] = createLettersMap(strings);
  const groupsOfAdjecentLetters: Letter[][] = [];

  lettersMap.forEach((lettersRow, rowIndex) => {
    lettersRow.forEach((letter, colIndex) => {
      if (letter.value !== ' ' && !letter.visited) {
        letter.visited = true;
        groupsOfAdjecentLetters.push(createBottomAndRightAdjecentLettersGroup(lettersMap, letter));
      }
    });
  });

  return groupsOfAdjecentLetters;
}

function createBottomAndRightAdjecentLettersGroup(
  lettersMap: Letter[][],
  letter: Letter
): Letter[] {
  const letterGroup = [letter];
  const stack = [letter];

  while (stack.length) {
    const tempLetter = stack.pop()!;
    const adjecentPositionsToCheck = [
      [tempLetter.position[0] - 1, tempLetter.position[1]],
      [tempLetter.position[0], tempLetter.position[1] + 1],
      [tempLetter.position[0] + 1, tempLetter.position[1]],
      [tempLetter.position[0], tempLetter.position[1] - 1],
    ];

    adjecentPositionsToCheck.forEach((adjecentPosition) => {
      if (isPositionWithinBounds(lettersMap, adjecentPosition[0], adjecentPosition[1])) {
        const adjecentLetter = lettersMap[adjecentPosition[0]][adjecentPosition[1]];
        if (adjecentLetter.value === ' ' || adjecentLetter.visited) return;
        adjecentLetter.visited = true;
        stack.push(adjecentLetter);
        letterGroup.push(adjecentLetter);
      }
    });
  }

  return letterGroup;
}

function isPositionWithinBounds(arr: any[][], x: number, y: number) {
  return x >= 0 && x < arr.length && y >= 0 && y < arr[x].length;
}
