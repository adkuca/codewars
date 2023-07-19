export function sumOfIntervals(intervals: [number, number][]) {
  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);

  let latestStart = sortedIntervals[0][0];
  let latestEnd = sortedIntervals[0][1];
  let sum = 0;

  const sortedIntervalsLength = sortedIntervals.length;
  for (let index = 1; index < sortedIntervalsLength; index += 1) {
    const currentStart = sortedIntervals[index][0];
    const currentEnd = sortedIntervals[index][1];

    if (currentStart > latestEnd) {
      sum += latestEnd - latestStart;
      latestStart = currentStart;
    }

    if (currentEnd > latestEnd) latestEnd = currentEnd;
  }

  sum += latestEnd - latestStart;

  return sum;
}
