import DICT_ZI from "./data/dict-zi"; // 单个汉字拼音数据。
import DICT_PHRASES from "./data/phrases-dict"; // 词组拼音数据。
import { segment } from "./segment";
import { toFixed } from "./format";
import { combo, compact } from "./util";
import { ENUM_PINYIN_STYLE } from "./constant";
import type {
  IPinyinAllOptions,
  IPinyinOptions,
  IPinyinStyle,
  IPinyinSegment,
} from "./declare";

const DEFAULT_OPTIONS: IPinyinAllOptions = {
  style: ENUM_PINYIN_STYLE.TONE, // 风格
  heteronym: false, // 多音字
  group: false,     // 词组拼音分组
  compact: false,
};

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
]);

// 将用户输入的拼音形式参数转换成唯一指定的强类型。
function convertPinyinStyle(style?: IPinyinStyle): ENUM_PINYIN_STYLE {
  const s = String(style);
  if (pinyinStyleMap.has(s)) {
    return pinyinStyleMap.get(s) as ENUM_PINYIN_STYLE;
  }
  return ENUM_PINYIN_STYLE.TONE;
}

function convertUserOptions(options?: IPinyinOptions): IPinyinAllOptions {
  let segment: IPinyinSegment | undefined = undefined;
  if (options?.segment) {
    if (options?.segment === true) {
      segment = "nodejieba";
    } else {
      segment = options.segment;
    }
  }
  const opt: IPinyinAllOptions = {
    ...DEFAULT_OPTIONS,
    style: convertPinyinStyle(options?.style),
    segment,
    heteronym: options?.heteronym || false,
    group: options?.group || false,
  };
  return opt;
}

/**
 * 拼音转换入口。
 */
export function pinyin(hans: string, options?: IPinyinOptions): string[][] {
  if(typeof hans !== "string") {
    return [];
  }
  const opt: IPinyinAllOptions = {
    ...DEFAULT_OPTIONS,
    ...convertUserOptions(options),
  };

  let pys;
  // 因为分词结果有词性信息，结构不同，处理也不相同，所以需要分别处理。
  if (opt.segment) {
    // 分词加词性标注转换。
    pys = segment_pinyin(hans, opt);
  } else {
    // 单字拆分转换。连续的非中文字符作为一个词（原样输出，不转换成拼音）。
    pys = normal_pinyin(hans, opt);
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

/**
 * 比较两个汉字转成拼音后的排序顺序，可以用作默认的拼音排序算法。
 *
 * @param {String} hanA 汉字字符串 A。
 * @return {String} hanB 汉字字符串 B。
 * @return {Number} 返回 -1，0，或 1。
 */
export function compare(hanA: string, hanB: string): number {
  const pinyinA = pinyin(hanA, DEFAULT_OPTIONS);
  const pinyinB = pinyin(hanB, DEFAULT_OPTIONS);
  return String(pinyinA).localeCompare(String(pinyinB));
}

export { compact } from './util';
