/**
 * 组合 2 个拼音数组。
 * @param {string[]} a1 第一个数组，形如 ["zhāo", "cháo"]
 * @param {string[]} a2 字符串型数组。形如 ["yáng"]
 * @return {string[]} 组合后的一维数组，如上可得 ["zhāoyáng", "cháoyáng"]
 */
export function combo2array(a1: string[], a2: string[]): string[] {
  const result: string[] = [];
  if (!a1.length) {
    return a2;
  }
  if (!a2.length) {
    return a1;
  }
  for (let i = 0, l = a1.length; i < l; i++) {
    for (let j = 0, m = a2.length; j < m; j++) {
      result.push(a1[i] + a2[j]);
    }
  }
  return result;
}

/**
 * 合并二维元祖。
 * @param {string[][]} arr 二维元祖 [["zhāo", "cháo"], ["yáng"], ["dōng"], ["shēng"]]
 * @return {string[]} 返回二维字符串组合数组。形如
 *  [
 *    ["zhāoyáng"], ["dōng"], ["shēng"],
 *    ["cháoyáng"], ["dōng"], ["shēng"]
 *  ]
 */
export function combo(arr: string[][]): string[] {
  if (arr.length === 0) {
    return [];
  }
  if (arr.length === 1) {
    return arr[0];
  }
  let result: string[] = combo2array(arr[0], arr[1]);
  for (let i = 2, l = arr.length; i < l; i++) {
    result = combo2array(result, arr[i]);
  }
  return result;
}

/**
 * 组合两个拼音数组，形成一个新的二维数组
 * @param {string[]|string[][]} arr1 eg: ["hai", "huan"]
 * @param {string[]} arr2 eg: ["qian"]
 * @returns {string[][]} 组合后的二维数组，eg: [ ["hai", "qian"], ["huan", "qian"] ]
 */
export function compact2array(a1: string[]|string[][], a2: string[]): string[][] {
  if (!Array.isArray(a1) || !Array.isArray(a2)) {
    throw new Error("compact2array expect two array as parameters");
  }
  if (!a1.length) {
    a1 = [""];
  }
  if (!a2.length) {
    a2 = [""];
  }
  const result: string[][] = [];
  for (let i = 0, l = a1.length; i < l; i++) {
    for (let j = 0, m = a2.length; j < m; j++) {
      if (Array.isArray(a1[i])) {
        result.push([...a1[i], a2[j]]);
      } else {
        result.push([a1[i] as string, a2[j]]);
      }
    }
  }
  return result;
}

export function compact(arr: string[][]) {
  if (arr.length === 0) {
    return [];
  }
  if (arr.length === 1) {
    return [arr[0]];
  }
  let result = compact2array(arr[0], arr[1]);
  for (let i = 2, l = arr.length; i < l; ++i) {
    result = compact2array(result, arr[i]);
  }
  return result;
}
