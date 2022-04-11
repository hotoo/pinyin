"use strict";

const assign = require("object-assign");
const SurnamePinyinData = require("../data/surname");
const CompoundSurnamePinyinData = require("../data/compound_surname");

// XXX: Symbol when web support.
const PINYIN_STYLE = {
  NORMAL: 0,       // 普通风格，不带声调。
  TONE: 1,         // 标准风格，声调在韵母的第一个字母上。
  TONE2: 2,        // 声调以数字形式在拼音之后，使用数字 0~4 标识。
  TO3NE: 5,        // 声调以数字形式在声母之后，使用数字 0~4 标识。
  INITIALS: 3,     // 仅需要声母部分。
  FIRST_LETTER: 4, // 仅保留首字母。
};
// 拼音模式。
const PINYIN_MODE = {
  NORMAL: 0, // 普通模式
  SURNAME: 1, // 姓氏
  PLACENAME: 2, // 地名
};
const DEFAULT_OPTIONS = {
  mode: PINYIN_MODE.NORMAL, // 拼音模式。
  style: PINYIN_STYLE.TONE, // 风格。
  segment: false,           // 分词。
  heteronym: false,         // 多音字。
};

// 声母表。
const INITIALS = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s".split(",");
// 韵母表。
//const FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
// 带声调字符。
const PHONETIC_SYMBOL = require("./phonetic-symbol");
const RE_PHONETIC_SYMBOL = new RegExp("([" + Object.keys(PHONETIC_SYMBOL).join("") + "])", "g");
const RE_TONE2 = /([aeoiuvnm])([0-4])$/;
const util = require("./util");

/*
 * 格式化拼音为声母（Initials）形式。
 * @param {String}
 * @return {String}
 */
function initials(pinyin) {
  for (let i = 0, l = INITIALS.length; i < l; i++){
    if (pinyin.indexOf(INITIALS[i]) === 0) {
      return INITIALS[i];
    }
  }
  return "";
}

class Pinyin {
  constructor (dict) {
    this._dict = dict;
  }

  // @param {String} hans 要转为拼音的目标字符串（汉字）。
  // @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
  // @return {Array} 返回的拼音列表。
  convert (hans, options) {

    if (typeof hans !== "string") {
      return [];
    }

    options = assign({}, DEFAULT_OPTIONS, options);

    let pys = [];
    let nohans = "";

    if (options.mode === PINYIN_MODE.SURNAME) {
      pys.push(this.surname_pinyin(hans, options));
    } else {

      for(let i = 0, firstCharCode, words, l = hans.length; i < l; i++) {

        words = hans[i];
        firstCharCode = words.charCodeAt(0);

        if(this._dict[firstCharCode]) {

          // ends of non-chinese words.
          if(nohans.length > 0) {
            pys.push([nohans]);
            nohans = ""; // reset non-chinese words.
          }

          pys.push(this.single_pinyin(words, options));

        } else {
          nohans += words;
        }
      }

    }

    // 清理最后的非中文字符串。
    if(nohans.length > 0){
      pys.push([nohans]);
    }

    Object.defineProperty(pys, "compact", {
      value: util.compact.bind(this, pys),
      enumerable: false,
      configurable: false,
    });

    return pys;
  }

  // 单字拼音转换。
  // @param {String} han, 单个汉字
  // @return {Array} 返回拼音列表，多音字会有多个拼音项。
  single_pinyin(han, options) {

    if (typeof han !== "string") {
      return [];
    }
    if (han.length !== 1) {
      return this.single_pinyin(han.charAt(0), options);
    }

    let hanCode = han.charCodeAt(0);

    if (!this._dict[hanCode]) {
      return [han];
    }

    let pys = this._dict[hanCode].split(",");
    if(!options.heteronym){
      return [Pinyin.toFixed(pys[0], options.style)];
    }

    // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
    let py_cached = {};
    let pinyins = [];
    for(let i = 0, py, l = pys.length; i < l; i++){
      py = Pinyin.toFixed(pys[i], options.style);
      if(py_cached.hasOwnProperty(py)){
        continue;
      }
      py_cached[py] = py;

      pinyins.push(py);
    }
    return pinyins;
  }

  // 姓名转成拼音
  surname_pinyin(hans, options) {
    return this.compound_surname(hans, options);
  }

  // 复姓处理
  compound_surname(hans, options) {
    let len = hans.length;
    let prefixIndex = 0;
    let result = [];
    function toFixed(item) {
      return item.map(ch => Pinyin.toFixed(ch, options.style));
    }
    for (let i = 0; i < len; i++) {
      const twowords = hans.substring(i, i + 2);
      if (CompoundSurnamePinyinData.hasOwnProperty(twowords)) {
        if (prefixIndex <= i - 1) {
          result = result.concat(
            this.single_surname(
              hans.substring(prefixIndex, i),
              options
            )
          );
        }
        result = result.concat(CompoundSurnamePinyinData[twowords].map(toFixed));

        i = i + 2;
        prefixIndex = i;
      }
    }
    // 处理复姓后面剩余的部分。
    result = result.concat(
      this.single_surname(
        hans.substring(prefixIndex, len),
        options
      )
    );
    return result;
  }

  // 单姓处理
  single_surname(hans, options) {
    let result = [];
    function toFixed(item) {
      return item.map(ch => Pinyin.toFixed(ch, options.style));
    }
    for (let i = 0, l = hans.length; i < l; i++) {
      const word = hans.charAt(i);
      if (SurnamePinyinData.hasOwnProperty(word)) {
        result = result.concat(SurnamePinyinData[word].map(toFixed));
      } else {
        result.push(this.single_pinyin(word, options));
      }
    }
    return result;
  }

  /**
   * 格式化拼音风格。
   *
   * @param {String} pinyin TONE 风格的拼音。
   * @param {ENUM} style 目标转换的拼音风格。
   * @return {String} 转换后的拼音。
   */
  static toFixed (pinyin, style) {
    let tone = ""; // 声调。
    let first_letter;
    let py;
    switch(style){
    case PINYIN_STYLE.INITIALS:
      return initials(pinyin);

    case PINYIN_STYLE.FIRST_LETTER:
      first_letter = pinyin.charAt(0);
      if (PHONETIC_SYMBOL.hasOwnProperty(first_letter)) {
        first_letter = PHONETIC_SYMBOL[first_letter].charAt(0);
      }
      return first_letter;

    case PINYIN_STYLE.NORMAL:
      return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1_phonetic){
        return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
      });

    case PINYIN_STYLE.TO3NE:
      return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1_phonetic){
        return PHONETIC_SYMBOL[$1_phonetic];
      });

    case PINYIN_STYLE.TONE2:
      py = pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1){
        // 声调数值。
        tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$2");

        return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
      });
      return py + tone;

    case PINYIN_STYLE.TONE:
    default:
      return pinyin;
    }
  }

  /**
   * 比较两个汉字转成拼音后的排序顺序，可以用作默认的拼音排序算法。
   *
   * @param {String} hanA 汉字字符串 A。
   * @return {String} hanB 汉字字符串 B。
   * @return {Number} 返回 -1，0，或 1。
   */
  compare (hanA, hanB) {
    const pinyinA = this.convert(hanA, DEFAULT_OPTIONS);
    const pinyinB = this.convert(hanB, DEFAULT_OPTIONS);
    return String(pinyinA).localeCompare(String(pinyinB));
  }

  compact(arr) {
    return util.compact(arr);
  }

  static get STYLE_NORMAL () {
    return PINYIN_STYLE.NORMAL;
  }
  static get STYLE_TONE () {
    return PINYIN_STYLE.TONE;
  }
  static get STYLE_TONE2 () {
    return PINYIN_STYLE.TONE2;
  }
  static get STYLE_TO3NE () {
    return PINYIN_STYLE.TO3NE;
  }
  static get STYLE_INITIALS () {
    return PINYIN_STYLE.INITIALS;
  }
  static get STYLE_FIRST_LETTER () {
    return PINYIN_STYLE.FIRST_LETTER;
  }
  static get MODE_NORMAL () {
    return PINYIN_MODE.NORMAL;
  }
  static get MODE_SURNAME () {
    return PINYIN_MODE.SURNAME;
  }
  static get MODE_PLACENAME () {
    return PINYIN_MODE.PLACENAME;
  }
  static get DEFAULT_OPTIONS () {
    return DEFAULT_OPTIONS;
  }
}

module.exports = Pinyin;
