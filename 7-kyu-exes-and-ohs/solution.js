function XO(str) {
  const strLen = str.length;
  let xCount = 0;
  let oCount = 0;
  for (
    let i = 0;
    i < strLen;
    v = str[i], 'x' === v || 'X' == v ? xCount++ : 'o' === v || 'O' === v ? oCount++ : null, i++
  );
  return xCount === oCount;
}
