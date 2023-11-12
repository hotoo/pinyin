import type {
  IPinyinAllOptions,
  IPinyinOptions,
  IPinyinStyle,
  IPinyinMode,
  IPinyinSegment,
} from "./declare";
import { ENUM_PINYIN_STYLE, ENUM_PINYIN_MODE, DEFAULT_OPTIONS } from "./constant";

export function hasKey(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

const pinyinStyleMap: Map<string, ENUM_PINYIN_STYLE> = new Map([
  [ "tone", ENUM_PINYIN_STYLE.TONE ],
  [ "TONE", ENUM_PINYIN_STYLE.TONE ],
  [ "1", ENUM_PINYIN_STYLE.TONE ],

  [ "tone2", ENUM_PINYIN_STYLE.TONE2 ],
  [ "TONE2", ENUM_PINYIN_STYLE.TONE2 ],
  [ "2", ENUM_PINYIN_STYLE.TONE2 ],

  [ "to3ne", ENUM_PINYIN_STYLE.TO3NE ],
  [ "TO3NE", ENUM_PINYIN_STYLE.TO3NE ],
  [ "5", ENUM_PINYIN_STYLE.TO3NE ],

  [ "first_letter", ENUM_PINYIN_STYLE.FIRST_LETTER ],
  [ "FIRST_LETTER", ENUM_PINYIN_STYLE.FIRST_LETTER ],
  [ "4", ENUM_PINYIN_STYLE.FIRST_LETTER ],

  [ "initials", ENUM_PINYIN_STYLE.INITIALS ],
  [ "INITIALS", ENUM_PINYIN_STYLE.INITIALS ],
  [ "3", ENUM_PINYIN_STYLE.INITIALS ],

  [ "normal", ENUM_PINYIN_STYLE.NORMAL ],
  [ "NORMAL", ENUM_PINYIN_STYLE.NORMAL ],
  [ "0", ENUM_PINYIN_STYLE.NORMAL ],

  [ "passport", ENUM_PINYIN_STYLE.PASSPORT ],
  [ "PASSPORT", ENUM_PINYIN_STYLE.PASSPORT ],
  [ "6", ENUM_PINYIN_STYLE.PASSPORT ],
]);

// 将用户输入的拼音形式参数转换成唯一指定的强类型。
export function convertPinyinStyle(style?: IPinyinStyle): ENUM_PINYIN_STYLE {
  const s = String(style);
  if (pinyinStyleMap.has(s)) {
    return pinyinStyleMap.get(s) as ENUM_PINYIN_STYLE;
  }
  return ENUM_PINYIN_STYLE.TONE;
}

const pinyinModeMap: Map<string, ENUM_PINYIN_MODE> = new Map([
  [ "normal", ENUM_PINYIN_MODE.NORMAL ],
  [ "NORMAL", ENUM_PINYIN_MODE.NORMAL ],
  [ "surname", ENUM_PINYIN_MODE.SURNAME ],
  [ "SURNAME", ENUM_PINYIN_MODE.SURNAME ],
]);

// 将用户输入的拼音形式参数转换成唯一指定的强类型。
export function convertPinyinMode(mode?: IPinyinMode): ENUM_PINYIN_MODE {
  const s = String(mode);
  if (pinyinModeMap.has(s)) {
    return pinyinModeMap.get(s) as ENUM_PINYIN_MODE;
  }
  return ENUM_PINYIN_MODE.NORMAL;
}

export function convertUserOptions(options?: IPinyinOptions): IPinyinAllOptions {
  let segment: IPinyinSegment | undefined = undefined;
  if (options?.segment) {
    if (options?.segment === true) {
      segment = "Intl.Segmenter";
    } else {
      segment = options.segment;
    }
  }
  const opt: IPinyinAllOptions = {
    ...DEFAULT_OPTIONS,
    style: convertPinyinStyle(options?.style),
    mode: convertPinyinMode(options?.mode),
    segment,
    heteronym: options?.heteronym || false,
    group: options?.group || false,
  };
  return opt;
}

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
