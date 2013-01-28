/**
 * pinyin(hans [,single] [,split]);
 * 极速，灵活，全面的拼音转换算法。
 *
 * TODO: 使用不带音标的拼音风格时，去除重复的拼音。
 *
 * @see http://py.kdd.cc/
 * @author 闲耘™ (@hotoo <hotoo.cn[AT]gmail.com>)
 * @version 2013/01/28, v2.0
 */

// 拼音词库。
var DICT = require("./pinyin-dict");
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
var PHONETIC_SYMBOL = {
  "ā": "a1",
  "á": "a2",
  "ǎ": "a3",
  "à": "a4",
  "ē": "e1",
  "é": "e2",
  "ě": "e3",
  "è": "e4",
  "ō": "o1",
  "ó": "o2",
  "ǒ": "o3",
  "ò": "o4",
  "ī": "i1",
  "í": "i2",
  "ǐ": "i3",
  "ì": "i4",
  "ū": "u1",
  "ú": "u2",
  "ǔ": "u3",
  "ù": "u4",
  "ü": "v0",
  "ǘ": "v2",
  "ǚ": "v3",
  "ǜ": "v4",
  "ń": "n2",
  "ň": "n3",
  "": "m2"
};
var re_phonetic_symbol_source = "";
for(var k in PHONETIC_SYMBOL){
    re_phonetic_symbol_source += k;
}
var RE_PHONETIC_SYMBOL = new RegExp('(['+re_phonetic_symbol_source+'])', 'g');
var RE_TONE2 = /[0-4]$/;
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
 * 修复拼音词库表中的格式。
 * @param {String} pinyin.
 * @param {PINYIN_STYLE} style.
 * @return {String}
 */
function toFixed(pinyin, style){
  var handle;
  switch(style){
  case PINYIN_STYLE.INITIALS:
    return initials(pinyin);
  case PINYIN_STYLE.FIRST_LETTER:
    return pinyin.charAt(0);
  case PINYIN_STYLE.NORMAL:
    handle = function($0, $1){
      return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "");
    }
    break;
  case PINYIN_STYLE.TONE2:
    handle = function($0, $1){
      return PHONETIC_SYMBOL[$1];
    }
    break;
  case PINYIN_STYLE.TONE:
  default:
    handle = function($0, $1){
      return $1;
    }
    break;
  }
  return pinyin.replace(RE_PHONETIC_SYMBOL, handle);
}

/**
 * 单字拼音转换。
 * @param {String} han, 汉字
 * @return {Array} 返回拼音列表，多音字会有多个拼音项。
 */
function single_pinyin(han, options){
  if("string" !== typeof han){return [];}
  options = extend(DEFAULT_OPTIONS, options);
  if(han.length !== 1){
    return single_pinyin(han.charAt(0), options);
  }
  if(!DICT.hasOwnProperty(han)){return [han];}
  var pys = DICT[han].split(",");
  if(!options.heteronym){
    return [toFixed(pys[0], options.style)];
  }
  // 临时存储已存在的拼音，避免重复。
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
 * @param {String} hans 要转为拼音的目标字符串（汉字）。
 * @param {Boolean} single 是否仅保留匹配的第一个拼音。
 * @param {String} sp 返回结果的分隔符，默认返回数组集合。
 * @return {String,Array} 如果 sp 为 null，则返回 Array。
 *                        否则，返回以 sp 分隔的字符串。
 */
function pinyin(hans, options){
  if("string" !== typeof hans){return [];}
  options = extend(DEFAULT_OPTIONS, options);
  var len = hans.length;
  var py = [];
  for(var i=0,l=len; i<l; i++){
    py.push(single_pinyin(hans[i], options));
  }
  return py;
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
