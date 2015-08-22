"use strict";

var isNode = typeof process === "object" &&
  process.toString() === "[object process]";

// 分词模块
var jieba;
var PHRASES_DICT;
var PINYIN_DICT;


// 解压拼音库。
// @param {Object} dict_combo, 压缩的拼音库。
// @param {Object} 解压的拼音库。
function buildPinyinCache(dict_combo){
  var hans;
  var uncomboed = {};

  for(var py in dict_combo){
    hans = dict_combo[py];
    for(var i = 0, han, l = hans.length; i < l; i++){
      han = hans.charCodeAt(i);
      if(!uncomboed.hasOwnProperty(han)){
        uncomboed[han] = py;
      }else{
        uncomboed[han] += "," + py;
      }
    }
  }

  return uncomboed;
}

function segment(hans) {
  try {
    jieba = jieba || module["require"]("nodejieba");
  } catch (ex) {
    console.error();
    console.error("    Segment need nodejieba, please run '$ npm install nodejieba'.");
    console.error("    分词需要使用 nodejieba 模块，请运行 '$ npm install nodejieba' 并确保安装完成。");
    console.error();
    throw ex;
  }
  // 词语拼音库。
  PHRASES_DICT = PHRASES_DICT || module["require"]("./phrases-dict");
  return jieba.cut(hans);
}
if(isNode){
  // 拼音词库，node 版无需使用压缩合并的拼音库。
  PINYIN_DICT = module["require"]("./dict-zi");
}else{
  PINYIN_DICT = buildPinyinCache(require("./dict-zi-web"));
}


// 声母表。
var INITIALS = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s".split(",");
// 韵母表。
//var FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
var PINYIN_STYLE = {
  NORMAL: 0,  // 普通风格，不带音标。
  TONE: 1,    // 标准风格，音标在韵母的第一个字母上。
  TONE2: 2,   // 声调中拼音之后，使用数字 1~4 标识。
  INITIALS: 3,// 仅需要声母部分。
  FIRST_LETTER: 4, // 仅保留首字母。
};
// 带音标字符。
var PHONETIC_SYMBOL = require("./phonetic-symbol.js");
var re_phonetic_symbol_source = "";
for(var k in PHONETIC_SYMBOL){
    re_phonetic_symbol_source += k;
}
var RE_PHONETIC_SYMBOL = new RegExp("([" + re_phonetic_symbol_source + "])", "g");
var RE_TONE2 = /([aeoiuvnm])([0-4])$/;
var DEFAULT_OPTIONS = {
  style: PINYIN_STYLE.TONE, // 风格
  segment: false, // 分词。
  heteronym: false, // 多音字
};


// 将 more 的属性值，覆盖 origin 中已有的属性。
// @param {Object} origin.
// @param {Object} more.
// @return 返回新的对象。
function extend(origin, more){
  var obj = {};
  for(var k in origin){
    if(more.hasOwnProperty(k)){
      obj[k] = more[k];
    }else{
      obj[k] = origin[k];
    }
  }
  return obj;
}

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

// 词语注音
// @param {String} phrases, 指定的词组。
// @param {Object} options, 选项。
// @return {Array}
function phrases_pinyin(phrases, options){
  var py = [];
  if(PHRASES_DICT.hasOwnProperty(phrases)){
    //! copy pinyin result.
    PHRASES_DICT[phrases].forEach(function(item, idx){
      py[idx] = [];
      if (options.heteronym){
        item.forEach(function(py_item, py_index){
          py[idx][py_index] = toFixed(py_item, options.style);
        });
      } else {
        py[idx][0] = toFixed(item[0], options.style);
      }
    });
  }else{
    for(var i = 0, l = phrases.length; i < l; i++){
      py.push(single_pinyin(phrases[i], options));
    }
  }
  return py;
}

// @param {String} hans 要转为拼音的目标字符串（汉字）。
// @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
// @return {Array} 返回的拼音列表。
function pinyin(hans, options){

  if(typeof hans !== "string"){
    return [];
  }

  options = extend(DEFAULT_OPTIONS, options || {});

  var phrases = isNode && options.segment ? segment(hans) : hans;
  var pys = [];

  for(var i = 0, nohans = "", firstCharCode, words, l = phrases.length; i < l; i++){

    words = phrases[i];
    firstCharCode = words.charCodeAt(0);

    if(PINYIN_DICT[firstCharCode]){

      // ends of non-chinese words.
      if(nohans.length > 0){
        pys.push([nohans]);
        nohans = ""; // reset non-chinese words.
      }

      if(words.length === 1){
          pys.push(single_pinyin(words, options));
      }else{
        pys = pys.concat(phrases_pinyin(words, options));
      }

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

module.exports = pinyin;
