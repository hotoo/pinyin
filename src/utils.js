
//const PINYIN_STYLE = {
  //NORMAL: Symbol(),       // 普通风格，不带音标。
  //TONE: Symbol(),         // 标准风格，音标在韵母的第一个字母上。
  //TONE2: Symbol(),        // 声调中拼音之后，使用数字 1~4 标识。
  //INITIALS: Symbol(),     // 仅需要声母部分。
  //FIRST_LETTER: Symbol(), // 仅保留首字母。
//};
const PINYIN_STYLE = {
  NORMAL: 0,       // 普通风格，不带音标。
  TONE: 1,         // 标准风格，音标在韵母的第一个字母上。
  TONE2: 2,        // 声调中拼音之后，使用数字 1~4 标识。
  INITIALS: 3,     // 仅需要声母部分。
  FIRST_LETTER: 4, // 仅保留首字母。
};

const DEFAULT_OPTIONS = {
  style: PINYIN_STYLE.TONE, // 风格
  segment: false, // 分词。
  heteronym: false // 多音字
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

module.exports = {
  PINYIN_STYLE: PINYIN_STYLE,
  DEFAULT_OPTIONS: DEFAULT_OPTIONS,
  extend: extend,
};
