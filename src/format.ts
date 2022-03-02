import { PINYIN_STYLE } from "./constant";
import PHONETIC_SYMBOL from "./phonetic-symbol"; // 带声调字符。

// 声母表。
const INITIALS: string[] = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s".split(",");
// 韵母表。
//const FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
const RE_PHONETIC_SYMBOL: RegExp = new RegExp("([" + Object.keys(PHONETIC_SYMBOL).join("") + "])", "g");
const RE_TONE2: RegExp = /([aeoiuvnm])([0-4])$/;

/*
 * 格式化拼音为声母（Initials）形式。
 * @param {string} py 原始拼音字符串。
 * @return {string} 转换后的拼音声母部分。
 */
function initials(py: string): string {
  for (let i = 0, l = INITIALS.length; i < l; i++){
    if (py.indexOf(INITIALS[i]) === 0) {
      return INITIALS[i];
    }
  }
  return "";
}

/**
 * 格式化拼音风格。
 *
 * @param {string} pinyin TONE 风格的拼音。
 * @param {PINYIN_STYLE} style 目标转换的拼音风格。
 * @return {string} 转换后的拼音。
 */
export function toFixed(pinyin: string, style: PINYIN_STYLE): string {
  let tone = ""; // 声调。
  let first_letter: string;
  let py: string;
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
    return pinyin.replace(RE_PHONETIC_SYMBOL, function($0: string, $1_phonetic: string){
      return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
    });

  case PINYIN_STYLE.TO3NE:
    return pinyin.replace(RE_PHONETIC_SYMBOL, function($0: string, $1_phonetic: string){
      return PHONETIC_SYMBOL[$1_phonetic];
    });

  case PINYIN_STYLE.TONE2:
    py = pinyin.replace(RE_PHONETIC_SYMBOL, function($0: string, $1: string){
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
