"use strict";

const assign = require("object-assign");
const PINYIN_DICT = require("../data/dict-zi");
const util = require("./util");
const Pinyin = require("./pinyin");
let jieba;
let PHRASES_DICT;

class NodePinyin extends Pinyin {

  // @param {String} hans 要转为拼音的目标字符串（汉字）。
  // @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
  // @return {Array} 返回的拼音列表。
  convert (hans, options) {
    if(typeof hans !== "string"){
      return [];
    }

    options = assign({}, Pinyin.DEFAULT_OPTIONS, options);
    let phrases = options && options.segment ? segment(hans) : hans;
    let pys = [];
    let nohans = "";

    for (let i = 0, firstCharCode, words, l = phrases.length; i < l; i++) {

      words = phrases[i];
      firstCharCode = words.charCodeAt(0);

      if(PINYIN_DICT[firstCharCode]){

        // ends of non-chinese words.
        if(nohans.length > 0){
          pys.push([nohans]);
          nohans = ""; // reset non-chinese words.
        }

        const newPys = words.length === 1
          ? super.convert(words, options)
          : this.phrases_pinyin(words, options);

        if (options.group) {
          pys.push(groupPhrases(newPys));
        } else {
          pys = pys.concat(newPys);
        }

      } else {
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

  // 词语注音
  // @param {String} phrases, 指定的词组。
  // @param {Object} options, 选项。
  // @return {Array}
  phrases_pinyin(phrases, options) {
    let py = [];
    if (PHRASES_DICT.hasOwnProperty(phrases)){
      //! copy pinyin result.
      PHRASES_DICT[phrases].forEach(function(item, idx){
        py[idx] = [];
        if (options.heteronym){
          item.forEach(function(py_item, py_index){
            py[idx][py_index] = Pinyin.toFixed(py_item, options.style);
          });
        } else {
          py[idx][0] = Pinyin.toFixed(item[0], options.style);
        }
      });
    } else {
      for(let i = 0, l = phrases.length; i < l; i++){
        py = py.concat(super.convert(phrases[i], options));
      }
    }
    return py;
  }
}

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
  PHRASES_DICT = PHRASES_DICT || require("../data/phrases-dict");
  return jieba.cutSmall(hans, 4);
}

function groupPhrases(phrases) {
  if (phrases.length === 1) {
    return phrases[0];
  }

  const grouped = util.combo(phrases);

  return grouped;
}

const pinyin = new NodePinyin(PINYIN_DICT);

module.exports = pinyin.convert.bind(pinyin);
module.exports.compare = pinyin.compare.bind(pinyin);
module.exports.STYLE_NORMAL = Pinyin.STYLE_NORMAL;
module.exports.STYLE_TONE = Pinyin.STYLE_TONE;
module.exports.STYLE_TONE2 = Pinyin.STYLE_TONE2;
module.exports.STYLE_TO3NE = Pinyin.STYLE_TO3NE;
module.exports.STYLE_INITIALS = Pinyin.STYLE_INITIALS;
module.exports.STYLE_FIRST_LETTER = Pinyin.STYLE_FIRST_LETTER;
