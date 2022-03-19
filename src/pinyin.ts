import DICT_ZI from "./data/dict-zi"; // 单个汉字拼音数据。
import DICT_PHRASES from "./data/phrases-dict"; // 词组拼音数据。
import { segment } from "./segment";
import { toFixed } from "./format";
import SurnamePinyinData from "./data/surname";
import CompoundSurnamePinyinData from "./data/compound_surname";
import { convertUserOptions, combo, compact } from "./util";
import { ENUM_PINYIN_MODE } from "./constant";
import type {
  IPinyinAllOptions,
  IPinyinOptions,
} from "./declare";

/**
 * 拼音转换入口。
 */
export function pinyin(hans: string, options?: IPinyinOptions): string[][] {
  if(typeof hans !== "string") {
    return [];
  }
  const opt: IPinyinAllOptions = convertUserOptions(options);

  let pys;
  if (opt.mode === ENUM_PINYIN_MODE.SURNAME) {
    pys = surname_pinyin(hans, opt);
  } else {
    // 因为分词结果有词性信息，结构不同，处理也不相同，所以需要分别处理。
    if (opt.segment) {
      // 分词加词性标注转换。
      pys = segment_pinyin(hans, opt);
    } else {
      // 单字拆分转换。连续的非中文字符作为一个词（原样输出，不转换成拼音）。
      pys = normal_pinyin(hans, opt);
    }
  }
  if (options?.compact) {
    pys = compact(pys);
  }
  return pys;
}

export default pinyin;

/**
 * 不使用分词算法的拼音转换。
 */
function normal_pinyin(hans: string, options: IPinyinAllOptions): string[][] {
  let pys: string[][] = [];
  let nohans = "";

  for(let i = 0, l = hans.length; i < l; i++) {
    const words = hans[i];
    const firstCharCode = words.charCodeAt(0);

    if(DICT_ZI[firstCharCode]){
      // 处理前面的“非中文”部分。
      if (nohans.length > 0) {
        pys.push([nohans]);
        nohans = ""; // 重置“非中文”缓存。
      }
      pys.push(single_pinyin(words, options));
    } else {
      nohans += words;
    }
  }

  // 清理最后的非中文字符串。
  if(nohans.length > 0){
    pys.push([nohans]);
    nohans = ""; // reset non-chinese words.
  }
  return pys;
}

/**
 * 单字拼音转换。
 * @param {String} han, 单个汉字
 * @return {Array} 返回拼音列表，多音字会有多个拼音项。
 */
function single_pinyin(han: string, options: IPinyinAllOptions): string[] {
  if (typeof han !== "string") {
    return [];
  }
  if (han.length !== 1) {
    return single_pinyin(han.charAt(0), options);
  }

  let hanCode = han.charCodeAt(0);

  if (!DICT_ZI[hanCode]) {
    return [han];
  }

  let pys = DICT_ZI[hanCode].split(",");
  if(!options.heteronym){
    return [toFixed(pys[0], options.style)];
  }

  // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
  let py_cached: Record<string,string> = {};
  let pinyins = [];
  for(let i = 0, l = pys.length; i < l; i++){
    const py = toFixed(pys[i], options.style);
    if(py_cached.hasOwnProperty(py)){
      continue;
    }
    py_cached[py] = py;

    pinyins.push(py);
  }
  return pinyins;
}

/**
 * 将文本分词，并转换成拼音。
 */
function segment_pinyin(hans: string, options: IPinyinAllOptions): string[][] {
  const phrases =  segment(hans, options.segment);
  let pys: string[][] = [];
  let nohans = "";
  for (let i = 0, l = phrases.length; i < l; i++) {
    const words = phrases[i];
    const firstCharCode = words.charCodeAt(0);

    if(DICT_ZI[firstCharCode]){
      // ends of non-chinese words.
      if(nohans.length > 0){
        pys.push([nohans]);
        nohans = ""; // reset non-chinese words.
      }

      const newPys = words.length === 1
        ? normal_pinyin(words, options)
        : phrases_pinyin(words, options);

      if (options.group) {
        pys.push(groupPhrases(newPys));
      } else {
        pys = pys.concat(newPys);
      }

    } else {
      nohans += words;
    }
  }

  // 清理最后的非中文字符串。
  if(nohans.length > 0){
    pys.push([nohans]);
    nohans = ""; // reset non-chinese words.
  }
  return pys;
}

/**
 * 词语注音
 * @param {String} phrases, 指定的词组。
 * @param {Object} options, 选项。
 * @return {Array}
 */
function phrases_pinyin(phrases: string, options: IPinyinAllOptions): string[][] {
  let py: string[][] = [];
  if (DICT_PHRASES.hasOwnProperty(phrases)) {
    //! copy pinyin result.
    DICT_PHRASES[phrases].forEach(function(item: string[], idx: number) {
      py[idx] = [];
      if (options.heteronym) {
        item.forEach(function(py_item, py_index) {
          py[idx][py_index] = toFixed(py_item, options.style);
        });
      } else {
        py[idx][0] = toFixed(item[0], options.style);
      }
    });
  } else {
    for(let i = 0, l = phrases.length; i < l; i++) {
      py.push(single_pinyin(phrases[i], options));
    }
  }
  return py;
}

function groupPhrases(phrases: string[][]): string[] {
  if (phrases.length === 1) {
    return phrases[0];
  }

  const grouped = combo(phrases);

  return grouped;
}

// 姓名转成拼音
function surname_pinyin(hans: string, options: IPinyinAllOptions): string[][] {
  return compound_surname(hans, options);
}

// 复姓处理
function compound_surname(hans: string, options: IPinyinAllOptions): string[][] {
  let len = hans.length;
  let prefixIndex = 0;
  let result: string[][] = [];
  for (let i = 0; i < len; i++) {
    const twowords = hans.substring(i, i + 2);
    if (CompoundSurnamePinyinData.hasOwnProperty(twowords)) {
      if (prefixIndex <= i - 1) {
        result = result.concat(
          single_surname(
            hans.substring(prefixIndex, i),
            options
          )
        );
      }
      result = result.concat(CompoundSurnamePinyinData[twowords]);

      i = i + 2;
      prefixIndex = i;
    }
  }
  // 处理复姓后面剩余的部分。
  result = result.concat(
    single_surname(
      hans.substring(prefixIndex, len),
      options
    )
  );
  return result;
}

// 单姓处理
function single_surname(hans: string, options: IPinyinAllOptions) {
  let result: string[][] = [];
  for (let i = 0, l = hans.length; i < l; i++) {
    const word = hans.charAt(i);
    if (SurnamePinyinData.hasOwnProperty(word)) {
      result = result.concat(SurnamePinyinData[word]);
    } else {
      result.push(single_pinyin(word, options));
    }
  }
  return result;
}

/**
 * 比较两个汉字转成拼音后的排序顺序，可以用作默认的拼音排序算法。
 *
 * @param {String} hanA 汉字字符串 A。
 * @return {String} hanB 汉字字符串 B。
 * @return {Number} 返回 -1，0，或 1。
 */
export function compare(hanA: string, hanB: string): number {
  const pinyinA = pinyin(hanA);
  const pinyinB = pinyin(hanB);
  return String(pinyinA).localeCompare(String(pinyinB));
}

export { compact } from './util';
