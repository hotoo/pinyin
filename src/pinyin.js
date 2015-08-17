"use strict";

let PINYIN_DICT = {};
const utils = require("./utils");
const PINYIN_STYLE = utils.PINYIN_STYLE;

// 声母表。
var INITIALS = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s".split(",");
// 韵母表。
//var FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
// 带音标字符。
var PHONETIC_SYMBOL = require("./phonetic-symbol.js");
var re_phonetic_symbol_source = "";
for(var k in PHONETIC_SYMBOL){
    re_phonetic_symbol_source += k;
}
var RE_PHONETIC_SYMBOL = new RegExp("([" + re_phonetic_symbol_source + "])", "g");
var RE_TONE2 = /([aeoiuvnm])([0-4])$/;



// 修改拼音词库表中的格式。
// @param {String} pinyin, 单个拼音。
// @param {PINYIN_STYLE} style, 拼音风格。
// @return {String}
function toFixed(pinyin, style){
  var tone = ""; // 声调。
  switch(style){
  case PINYIN_STYLE.INITIALS:
    return initials(pinyin);

  case PINYIN_STYLE.FIRST_LETTER:
    var first_letter = pinyin.charAt(0);
    if(PHONETIC_SYMBOL.hasOwnProperty(first_letter)){
      first_letter = PHONETIC_SYMBOL[first_letter].charAt(0);
    }
    return first_letter;

  case PINYIN_STYLE.NORMAL:
    return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1_phonetic){
      return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
    });

  case PINYIN_STYLE.TONE2:
    var py = pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1){
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

// 单字拼音转换。
// @param {String} han, 单个汉字
// @return {Array} 返回拼音列表，多音字会有多个拼音项。
function single_pinyin(han, options){

  if(typeof han !== "string"){
    return [];
  }
  if(han.length !== 1){
    return single_pinyin(han.charAt(0), options);
  }

  var hanCode = han.charCodeAt(0);

  if(!PINYIN_DICT[hanCode]){
    return [han];
  }

  var pys = PINYIN_DICT[hanCode].split(",");
  if(!options.heteronym){
    return [toFixed(pys[0], options.style)];
  }

  // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
  var py_cached = {};
  var pinyins = [];
  for(var i = 0, py, l = pys.length; i < l; i++){
    py = toFixed(pys[i], options.style);
    if(py_cached.hasOwnProperty(py)){
      continue;
    }
    py_cached[py] = py;

    pinyins.push(py);
  }
  return pinyins;
}

// @param {String} hans 要转为拼音的目标字符串（汉字）。
// @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
// @return {Array} 返回的拼音列表。
function pinyin(hans, options){

  if(typeof hans !== "string"){
    return [];
  }

  options = utils.extend(utils.DEFAULT_OPTIONS, options || {});

  var pys = [];

  for(var i = 0, nohans = "", firstCharCode, words, l = hans.length; i < l; i++){

    words = hans[i];
    firstCharCode = words.charCodeAt(0);

    if(PINYIN_DICT[firstCharCode]){

      // ends of non-chinese words.
      if(nohans.length > 0){
        pys.push([nohans]);
        nohans = ""; // reset non-chinese words.
      }

      pys.push(single_pinyin(words, options));

    }else{
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


// 格式化为声母(Initials)、韵母(Finals)。
// @param {String}
// @return {String}
function initials(pinyin) {
  for (var i = 0, l = INITIALS.length; i < l; i++){
    if (pinyin.indexOf(INITIALS[i]) === 0) {
      return INITIALS[i];
    }
  }
  return "";
}

pinyin.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
pinyin.STYLE_TONE = PINYIN_STYLE.TONE;
pinyin.STYLE_TONE2 = PINYIN_STYLE.TONE2;
pinyin.STYLE_INITIALS = PINYIN_STYLE.INITIALS;
pinyin.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;

pinyin.toFixed = toFixed;
pinyin.setDict = function(dict) {
  PINYIN_DICT = dict;
};

module.exports = pinyin;
