"use strict";

const utils = require("./src/utils");
const PINYIN_DICT = require("./data/dict-zi");
const pinyin = require("./src/pinyin");
let jieba;
let PHRASES_DICT;

pinyin.setDict(PINYIN_DICT);

function segment(hans) {
  try {
    jieba = jieba || require("nodejieba");
  } catch (ex) {
    console.error();
    console.error("    Segment need nodejieba, please run '$ npm install nodejieba'.");
    console.error("    分词需要使用 nodejieba 模块，请运行 '$ npm install nodejieba' 并确保安装完成。");
    console.error();
    throw ex;
  }
  // 词语拼音库。
  PHRASES_DICT = PHRASES_DICT || require("./data/phrases-dict");
  return jieba.cut(hans);
}

// 词语注音
// @param {String} phrases, 指定的词组。
// @param {Object} options, 选项。
// @return {Array}
function phrases_pinyin(phrases, options) {
  var py = [];
  if (PHRASES_DICT.hasOwnProperty(phrases)){
    //! copy pinyin result.
    PHRASES_DICT[phrases].forEach(function(item, idx){
      py[idx] = [];
      if (options.heteronym){
        item.forEach(function(py_item, py_index){
          py[idx][py_index] = pinyin.toFixed(py_item, options.style);
        });
      } else {
        py[idx][0] = pinyin.toFixed(item[0], options.style);
      }
    });
  } else {
    for(var i = 0, l = phrases.length; i < l; i++){
      py = py.concat(pinyin(phrases[i], options));
    }
  }
  return py;
}

// @param {String} hans 要转为拼音的目标字符串（汉字）。
// @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
// @return {Array} 返回的拼音列表。
module.exports = function(hans, options) {

  if(typeof hans !== "string"){
    return [];
  }

  options = utils.extend(utils.DEFAULT_OPTIONS, options || {});
  var phrases = options && options.segment ? segment(hans) : hans;
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
        pys = pys.concat(pinyin(words, options));
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
};
module.exports.STYLE_NORMAL = utils.PINYIN_STYLE.NORMAL;
module.exports.STYLE_TONE = utils.PINYIN_STYLE.TONE;
module.exports.STYLE_TONE2 = utils.PINYIN_STYLE.TONE2;
module.exports.STYLE_INITIALS = utils.PINYIN_STYLE.INITIALS;
module.exports.STYLE_FIRST_LETTER = utils.PINYIN_STYLE.FIRST_LETTER;
