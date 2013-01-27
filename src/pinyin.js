/**
 * pinyin(hans [,single] [,split]);
 * 极速，灵活，全面的拼音转换算法。
 *
 * @author 闲耘™ (@hotoo <hotoo.cn[AT]gmail.com>)
 * @version 2010/07/30, v1.0
 */

var PINYIN_DICT_CACHE = {};
/**
 * 设置拼音词典库。
 * 并进行缓存。
 * @param {Array} dict, 拼音词典数据。
 * @return {Boolean} 设置成功返回 true，否则返回 false.
 */
function setDictionary(dict){
  var len = dict.length;
  if(0 === len){return false;}
  PINYIN_DICT_CACHE = {};

  for(var i=0,hans,l=len; i<l; i++){
    hans = dict[i][1];
    for(var j=0,han,m=hans.length; j<m; j++){
      han = hans.charAt(j);
      if(!PINYIN_DICT_CACHE.hasOwnProperty(han)){
        PINYIN_DICT_CACHE[han] = [];
      }
      PINYIN_DICT_CACHE[han].push(dict[i][0]);
    }
  }
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
    var y = PINYIN_DICT_CACHE[hans];
    if(single){return y&&y[0]?y[0]:hans;}
    return y || [hans];
  }else{
    var py = [];
    for(var i=0,y; i<len; i++){
      y = PINYIN_DICT_CACHE[hans.charAt(i)];
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

exports.setDictionary = setDictionary;
exports.convert = pinyin;
