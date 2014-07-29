
var expect = require("expect.js");
var pinyin = require("../src/pinyin");


var cases = [

  // 单音字
  [ "我", {
    STYLE_NORMAL:       [["wo"]],
    STYLE_TONE:         [["wǒ"]],
    STYLE_TONE2:        [["wo3"]],
    STYLE_INITIALS:     [["w"]],
    STYLE_FIRST_LETTER: [["w"]]
  } ],

  // 多音字
  [ "中", {
    STYLE_NORMAL:       [["zhong"]],
    STYLE_TONE:         [["zhōng","zhòng"]],
    STYLE_TONE2:        [["zhong1","zhong4"]],
    STYLE_INITIALS:     [["zh"]],
    STYLE_FIRST_LETTER: [["z"]]
  } ],

  // 元音字
  ["爱", {
    STYLE_NORMAL:       [["ai"]],
    STYLE_TONE:         [["ài"]],
    STYLE_TONE2:        [["ai4"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["a"]]
  } ],
  ["啊", {
    STYLE_NORMAL:       [["a"]],
    STYLE_TONE:         [["ā","á","ǎ","à","a"]],
    STYLE_TONE2:        [["a1","a2","a3","a4","a"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["a"]]
  } ],

  // 单音词
  [ "我是谁", {
    STYLE_NORMAL:       [["wo"],["shi"],["shui"]],
    STYLE_TONE:         [["wǒ"],["shì"],["shuí"]],
    STYLE_TONE2:        [["wo3"],["shi4"],["shui2"]],
    STYLE_INITIALS:     [["w"],["sh"],["sh"]],
    STYLE_FIRST_LETTER: [["w"],["s"],["s"]]
  } ],

  // 多音字，单音词。分词后可以准确识别读音。
  [ "中国", {
    STYLE_NORMAL:       [["zhong"],["guo"]],
    STYLE_TONE:         [["zhōng"],["guó"]],
    STYLE_TONE2:        [["zhong1"],["guo2"]],
    STYLE_INITIALS:     [["zh"],["g"]],
    STYLE_FIRST_LETTER: [["z"],["g"]]
  } ],
  [ "重心", {
    STYLE_NORMAL:       [["zhong"],["xin"]],
    STYLE_TONE:         [["zhòng"],["xīn"]],
    STYLE_TONE2:        [["zhong4"],["xin1"]],
    STYLE_INITIALS:     [["zh"],["x"]],
    STYLE_FIRST_LETTER: [["z"],["x"]],
  } ],

  // 英文
  [ "a", {
    STYLE_NORMAL:       [["a"]],
    STYLE_TONE:         [["a"]],
    STYLE_TONE2:        [["a"]],
    STYLE_INITIALS:     [["a"]],
    STYLE_FIRST_LETTER: [["a"]]
  } ],
  [ "aa", {
    STYLE_NORMAL:       [["aa"]],
    STYLE_TONE:         [["aa"]],
    STYLE_TONE2:        [["aa"]],
    STYLE_INITIALS:     [["aa"]],
    STYLE_FIRST_LETTER: [["aa"]]
  } ],
  //[ "a a", {
    //STYLE_NORMAL:       [["a a"]],
    //STYLE_TONE:         [["a a"]],
    //STYLE_TONE2:        [["a a"]],
    //STYLE_INITIALS:     [["a a"]],
    //STYLE_FIRST_LETTER: [["a a"]]
  //} ],
  [ "一 一", {
    STYLE_NORMAL:       [["yi"],["yi"]],
    STYLE_TONE:         [["yī"],["yī"]],
    STYLE_TONE2:        [["yi1"],["yi1"]],
    STYLE_INITIALS:     [["y"],["y"]],
    STYLE_FIRST_LETTER: [["y"],["y"]]
  } ],

  // 中英混合
  [ "拼音(pinyin)", {
    STYLE_NORMAL:       [["pin"],["yin"],["(pinyin)"]],
    STYLE_TONE:         [["pīn"],["yīn"],["(pinyin)"]],
    STYLE_TONE2:        [["pin1"],["yin1"],["(pinyin)"]],
    STYLE_INITIALS:     [["p"],["y"],["(pinyin)"]],
    STYLE_FIRST_LETTER: [["p"],["y"],["(pinyin)"]]
  } ],

  // 中英混合，多音字，单音词。
  [ "中国(china)", {
    STYLE_NORMAL:       [["zhong"],["guo"],["(china)"]],
    STYLE_TONE:         [["zhōng"],["guó"],["(china)"]],
    STYLE_TONE2:        [["zhong1"],["guo2"],["(china)"]],
    STYLE_INITIALS:     [["zh"],["g"],["(china)"]],
    STYLE_FIRST_LETTER: [["z"],["g"],["(china)"]]
  } ]
];

describe('pinyin', function() {

  for(var i=0,han,opt,py,l=cases.length; i<l; i++){
    han = cases[i][0];
    opt = cases[i][1];
    for(var style in opt){
      (function(han, opt, style){
        var py = opt[style];
        var single_pinyin = [];
        for(var i=0,l=py.length; i<l; i++){
          single_pinyin[i] = [py[i][0]];
        }

        // 非多音字模式。
        var _py = pinyin(han, {style: pinyin[style]});
        it('pinyin("'+han+'", '+style+') : '+
          JSON.stringify(_py)+' === '+JSON.stringify(single_pinyin), function() {

          expect(deepEquals(_py, single_pinyin)).to.equal(true);
        });

        // 多音字模式。
        var _py2 = pinyin(han, {style: pinyin[style], heteronym:true});
        it('pinyin("'+han+'", '+style+',heteronym) : '+
          JSON.stringify(_py2)+' === '+JSON.stringify(py), function() {

          expect(deepEquals(_py2, py)).to.equal(true);
        });
      })(han, opt, style);
    }
  }
});

function deepEquals(a, b){
  if(a === b){return true;}
  var typeA = Object.prototype.toString.call(a);
  var typeB = Object.prototype.toString.call(b);
  if(typeA !== typeB){return false;}
  var eq = true;
  var re_blank = /\s{2,}/, s_blank = " ";
  switch(typeA){
  case '[object String]':
  case '[object Number]':
  case '[object Boolean]':
    return a === b;
  case '[object RegExp]':
    return a.source === b.source &&
      a.ignoreCase === b.ignoreCase &&
      a.multiline == b.multiline &&
      a.global === b.global;
  case '[object Object]':
    for(var k in a){
      if(!a.hasOwnProperty(k)){continue;}
      if(!b.hasOwnProperty(k)){return false;}
      eq = eq && deepEquals(a[k], b[k]);
    }
    if(!eq){return false;}
    for(var k in b){
      if(!b.hasOwnProperty(k)){continue;}
      if(!a.hasOwnProperty(k)){return false;}
    }
    return true;
  case '[object Array]':
    if(a.length !== b.length){return false;}
    for(var i=0,l=a.length; i<l; i++){
      eq = eq && deepEquals(a[i], b[i]);
    }
    return eq;
  case '[object Function]':
    return a.toString().replace(re_blank, s_blank) ===
      b.toString().replace(re_blank, s_blank);
  default:
    throw new Error("Not support type "+typeA);
    break;
  }
}

console.log("DEEP EQUALS:", deepEquals([["zhong"],["guo"]] , [["zhong"],["guo"]]))
