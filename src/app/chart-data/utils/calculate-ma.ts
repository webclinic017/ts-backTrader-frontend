export const calculateMA = (dayCount: number, data0: { values: (number | string)[][] }) => {
  const result = [];
  let i = 0;
  const len = data0.values.length;
  for (; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += +data0.values[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
};
