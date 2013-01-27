/**
 * pinyin(hans [,single] [,split]);
 * 极速，灵活，全面的拼音转换算法。
 *
 * @see http://py.kdd.cc/
 * @author 闲耘™ (@hotoo <hotoo.cn[AT]gmail.com>)
 * @version 2010/07/30, v1.0
 */

// 拼音词库。
var DICT = require("./pinyin-dict");
// 声母表。
var INITIALS = "zh,ch,sh,b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,z,c,s".split(",");
// 韵母表。
var FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
var PINYIN_FORMAT =  {
  NORMAL: 0,  // 普通格式，不带音标。
  TONE: 1,    // 标准模式，音标中
  TONE2: 2    // 声调中拼音之后，使用数字 1~4 标识。
};
// 带音标字符。
var PHONETIC_SYMBOL = {
  "ā": "a1",
  "á": "a2",
  "ǎ": "a3",
  "à": "a4",
  "ē": "e1"
  // ...
};
var re_phonetic_symbol_source = "";
for(var k in PHONETIC_SYMBOL){
    re_phonetic_symbol_source += k;
}
var RE_PHONETIC_SYMBOL = new RegExp('(['+re_phonetic_symbol_source+'])', 'g');
var RE_TONE2 = /[1-4]$/;

/**
 * 修复拼音词库表中的格式。
 * @param {String} pinyin.
 * @param {PINYIN_FORMAT}
 * @return {String}
 */
function toFixed(pinyin, format){
  return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1){
    var py = PHONETIC_SYMBOL[$1];
    if(format === PINYIN_FORMAT.NORMAL){
      return py.replace(RE_TONE2, "");
    }else if(format === PINYIN_FORMAT.TONE2){
      return py;
    }
  });
}

/*
 * 笛卡尔乘积，返回两个数组的所有可能的组合。
 * @param {Array}
 * @param {Array}
 * @return {Array}
 */
function product(a,b){
  var r=[];
  for (var i=0,l=a.length; i<l; i++){
    for (var j=0,m=b.length; j<m; j++){
      r[r.length] = (a[i] instanceof Array) ? a[i].concat(b[j]) : [].concat(a[i],b[j]);
    }
  }
  return r;
}


/**
 * @param {String} hans 要转为拼音的目标字符串（汉字）。
 * @param {Boolean} single 是否仅保留匹配的第一个拼音。
 * @param {String} sp 返回结果的分隔符，默认返回数组集合。
 * @return {String,Array} 如果 sp 为 null，则返回 Array。
 *                        否则，返回以 sp 分隔的字符串。
 */
function pinyin(hans, single, sp){
  var len = hans.length;
  if(len==0){return single?"":[];}
  if(len==1){
    var y = DICT[hans].split(",");
    if(single){return y&&y[0]?y[0]:hans;}
    return y || [hans];
  }else{
    var py = [];
    for(var i=0,y; i<len; i++){
      y = DICT[hans.charAt(i)].split(",");
      if(y){
        py[py.length] = single?y[0]:y;
      }else{
        py[py.length] = single?hans.charAt(i):[hans.charAt(i)];
      }
    }
    if(single){return sp==null?py:py.join(sp||"");}

    var pys=py[0];
    var r=pys[0]
      for (var i=1,l=py.length; i<l; i++){
        pys = product(pys, py[i]);
      }
    return sp==null?pys:pys.join(sp||"");
  }
}

/**
 * 声母(Initials)、韵母(Finals)。
 * @param {String/Number/RegExp/Date/Function/Array/Object}
 * @return {String/Number/RegExp/Date/Function/Array/Object}
 */
function initials(pinyin){
  for(var i=0,l=DOUBLE_INITIALS.length; i<l; i++){
    if(pinyin.indexOf(DOUBLE_INITIALS[i]) === 0){
      return DOUBLE_INITIALS[i];
    }
  }
  return "";
}

module.exports = pinyin;
exports.NORMAL = PINYIN_FORMAT.NORMAL;
