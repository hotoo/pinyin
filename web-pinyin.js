
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

const PINYIN_DICT = buildPinyinCache(require("./data/dict-zi-web"));
const pinyin = require("./src/pinyin");
pinyin.setDict(PINYIN_DICT);

module.exports = pinyin;
