/**
 * pinyin(hans[, options]);
 * 极速，灵活，全面的拼音转换算法。
 *
 * @author 闲耘™ (@hotoo <hotoo.cn[AT]gmail.com>)
 * @version 2013/01/28, v2.1
 */

// 分词模块
var Segment = require("segment").Segment;
var segment = new Segment();
// 使用默认的识别模块及字典
segment.useDefault();

// 词语拼音库。
var PHRASES_DICT = require("./phrases-dict.js");

// 拼音词库，node 版无需使用压缩合并的拼音库。
var PINYIN_DICT = require("./pinyin-dict");
// 声母表。
var INITIALS = "zh,ch,sh,b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,z,c,s,yu,y,w".split(",");
// 韵母表。
var FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
var PINYIN_STYLE =  {
  NORMAL: 0,  // 普通风格，不带音标。
  TONE: 1,    // 标准风格，音标在韵母的第一个字母上。
  TONE2: 2,   // 声调中拼音之后，使用数字 1~4 标识。
  INITIALS: 3,// 仅需要声母部分。
  FIRST_LETTER: 4 // 仅保留首字母。
};
// 带音标字符。
var PHONETIC_SYMBOL = require("./phonetic-symbol.js");
var re_phonetic_symbol_source = "";
for(var k in PHONETIC_SYMBOL){
    re_phonetic_symbol_source += k;
}
var RE_PHONETIC_SYMBOL = new RegExp('(['+re_phonetic_symbol_source+'])', 'g');
var RE_TONE2 = /([aeoiuvnm])([0-4])$/;
var DEFAULT_OPTIONS = {
  style: PINYIN_STYLE.TONE, // 风格
  heteronym: false // 多音字
};

function extend(origin, more){
  if(!more){return origin;}
  var obj = {};
  for(var k in origin){
    if(more.hasOwnProperty(k)){
      obj[k] = more[k]
    }else{
      obj[k] = origin[k]
    }
  }
  return obj;
}

/**
 * 修改拼音词库表中的格式。
 * @param {String} pinyin, 单个拼音。
 * @param {PINYIN_STYLE} style, 拼音风格。
 * @return {String}
 */
function toFixed(pinyin, style){
  var handle;
  var tone; // 声调。
  switch(style){
  case PINYIN_STYLE.INITIALS:
    return initials(pinyin);
  case PINYIN_STYLE.FIRST_LETTER:
    return pinyin.charAt(0);
  case PINYIN_STYLE.NORMAL:
    handle = function($0, $1){
      return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
    }
    break;
  case PINYIN_STYLE.TONE2:
    handle = function($0, $1){
      tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$2");
      return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
    }
    break;
  case PINYIN_STYLE.TONE:
  default:
    handle = function($0, $1){
      return $1;
    }
    break;
  }
  var py = pinyin.replace(RE_PHONETIC_SYMBOL, handle);
  if(style === PINYIN_STYLE.TONE2){
    py += tone;
  }
  return py;
}

/**
 * 单字拼音转换。
 * @param {String} han, 单个汉字
 * @return {Array} 返回拼音列表，多音字会有多个拼音项。
 */
function single_pinyin(han, options){
  if("string" !== typeof han){return [];}
  options = extend(DEFAULT_OPTIONS, options);
  if(han.length !== 1){
    return single_pinyin(han.charAt(0), options);
  }
  if(!PINYIN_DICT.hasOwnProperty(han)){return [han];}
  var pys = PINYIN_DICT[han].split(",");
  if(!options.heteronym){
    return [toFixed(pys[0], options.style)];
  }
  // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
  var py_cached = {};
  var pinyins = [];
  for(var i=0,py,l=pys.length; i<l; i++){
    py = toFixed(pys[i], options.style);
    if(py_cached.hasOwnProperty(py)){continue;}
    py_cached[py] = py;

    pinyins.push(py);
  }
  return pinyins;
}

/**
 * 词语注音
 * @param {String} phrases, 指定的词组。
 * @param {Object} options, 选项。
 * @return {Array}
 */
function phrases_pinyin(phrases, options){
  var py = [];
  if(PHRASES_DICT.hasOwnProperty(phrases)){
    py = PHRASES_DICT[phrases];
    py.forEach(function(item, idx, arr){
      arr[idx] = [toFixed(item[0], options.style)];
    });
  }else{
    for(var i=0,l=phrases.length; i<l; i++){
      py.push(single_pinyin(phrases[i], options));
    }
  }
  return py;
}

/**
 * @param {String} hans 要转为拼音的目标字符串（汉字）。
 * @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
 * @return {Array} 返回的拼音列表。
 */
function pinyin(hans, options){
  if("string" !== typeof hans){return [];}
  options = extend(DEFAULT_OPTIONS, options);
  var phrases = segment.doSegment(hans);
  //console.log("phrases:", phrases);
  var len = hans.length;
  var pys = [];
  for(var i=0,words,l=phrases.length; i<l; i++){
    words = phrases[i].w;
    if(words.length===1){
      pys.push(single_pinyin(words, options));
    }else{
      pys = pys.concat(phrases_pinyin(words, options));
    }
  }
  //for(var i=0,l=len; i<l; i++){
    //py.push(single_pinyin(hans[i], options));
  //}
  return pys;
}


/**
 * 声母(Initials)、韵母(Finals)。
 * @param {String/Number/RegExp/Date/Function/Array/Object}
 * @return {String/Number/RegExp/Date/Function/Array/Object}
 */
function initials(pinyin){
  for(var i=0,l=INITIALS.length; i<l; i++){
    if(pinyin.indexOf(INITIALS[i]) === 0){
      return INITIALS[i];
    }
  }
  return "";
}

module.exports = pinyin;
module.exports.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
module.exports.STYLE_TONE = PINYIN_STYLE.TONE;
module.exports.STYLE_TONE2 = PINYIN_STYLE.TONE2;
module.exports.STYLE_INITIALS = PINYIN_STYLE.INITIALS;
module.exports.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;
