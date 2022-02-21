"use strict";

/**
 * 组合 2 个拼音数组。
 * @param {Array<String>} a1 第一个数组，形如 ["zhāo", "cháo"]
 * @param {Array<String>} a2 字符串型数组。形如 ["yáng"]
 * @return {Array<String>} 组合后的一维数组，如上可得 ["zhāoyáng", "cháoyáng"]
 */
function combo2array(a1, a2) {
  const result = [];
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
 * @param {Array<Array<String>>} arr 二维元祖 [["zhāo", "cháo"], ["yáng"], ["dōng"], ["shēng"]]
 * @return {Array<String>} 返回二维字符串组合数组。形如
 *  [
 *    ["zhāoyáng"], ["dōng"], ["shēng"],
 *    ["cháoyáng"], ["dōng"], ["shēng"]
 *  ]
 */
function combo(arr) {
  if (arr.length === 0) {
    return [];
  }
  if (arr.length === 1) {
    return arr[0];
  }
  let result = combo2array(arr[0], arr[1]);
  for (let i = 2, l = arr.length; i < l; i++) {
    result = combo2array(result, arr[i]);
  }
  return result;
}

/**
 * 组合两个拼音数组，形成一个新的二维数组
 * @param {string[]|string[][]} arr1 eg: ["hai", "huan"]
 * @param {Array<String>} arr2 eg: ["qian"]
 * @returns {string[][]} 组合后的二维数组，eg: [ ["hai", "qian"], ["huan", "qian"] ]
 */
function compact2array(a1, a2) {
  if (!Array.isArray(a1) || !Array.isArray(a2)) {
    throw new Error("compact2array expect two array as parameters");
  }
  if (!a1.length) {
    a1 = [""];
  }
  if (!a2.length) {
    a2 = [""];
  }
  const result = [];
  for (let i = 0, l = a1.length; i < l; i++) {
    for (let j = 0, m = a2.length; j < m; j++) {
      if (Array.isArray(a1[i])) {
        result.push([...a1[i], a2[j]]);
      } else {
        result.push([a1[i], a2[j]]);
      }
    }
  }
  return result;
}

function compact(arr) {
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

exports.combo2array = combo2array;
exports.combo = combo;
exports.compact2array = compact2array;
exports.compact = compact;
