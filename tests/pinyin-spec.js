
const expect = require("expect.js");
const pinyin = require("../lib/web-pinyin");

const cases = [

  // 单音字
  [ "我", {
    STYLE_NORMAL:       [["wo"]],
    STYLE_TONE:         [["wǒ"]],
    STYLE_TONE2:        [["wo3"]],
    STYLE_TO3NE:        [["wo3"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["w"]],
  } ],

  // 多音字
  [ "中", {
    STYLE_NORMAL:       [["zhong"]],
    STYLE_TONE:         [["zhōng", "zhòng"]],
    STYLE_TONE2:        [["zhong1", "zhong4"]],
    STYLE_TO3NE:        [["zho1ng", "zho4ng"]],
    STYLE_INITIALS:     [["zh"]],
    STYLE_FIRST_LETTER: [["z"]],
  } ],
  [ "的", {
    STYLE_NORMAL:       [["de", "di"]],
    STYLE_TONE:         [["de", "dì", "dí"]],
    STYLE_TONE2:        [["de", "di4", "di2"]],
    STYLE_TO3NE:        [["de", "di4", "di2"]],
    STYLE_INITIALS:     [["d"]],
    STYLE_FIRST_LETTER: [["d"]],
  } ],

  // 元音字
  ["爱", {
    STYLE_NORMAL:       [["ai"]],
    STYLE_TONE:         [["ài"]],
    STYLE_TONE2:        [["ai4"]],
    STYLE_TO3NE:        [["a4i"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["a"]],
  } ],
  ["啊", {
    STYLE_NORMAL:       [["a"]],
    STYLE_TONE:         [["ā", "á", "ǎ", "à", "a"]],
    STYLE_TONE2:        [["a1", "a2", "a3", "a4", "a"]],
    STYLE_TO3NE:        [["a1", "a2", "a3", "a4", "a"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["a"]],
  } ],

  // 单音词
  [ "我是谁", {
    STYLE_NORMAL:       [["wo"], ["shi"], ["shui"]],
    STYLE_TONE:         [["wǒ"], ["shì"], ["shuí"]],
    STYLE_TONE2:        [["wo3"], ["shi4"], ["shui2"]],
    STYLE_TO3NE:        [["wo3"], ["shi4"], ["shui2"]],
    STYLE_INITIALS:     [[""], ["sh"], ["sh"]],
    STYLE_FIRST_LETTER: [["w"], ["s"], ["s"]],
  } ],

  // 多音词
  [ "中国", {
    STYLE_NORMAL:       [["zhong"], ["guo"]],
    STYLE_TONE:         [["zhōng", "zhòng"], ["guó"]],
    STYLE_TONE2:        [["zhong1", "zhong4"], ["guo2"]],
    STYLE_TO3NE:        [["zho1ng", "zho4ng"], ["guo2"]],
    STYLE_INITIALS:     [["zh"], ["g"]],
    STYLE_FIRST_LETTER: [["z"], ["g"]],
  } ],
  [ "重心", {
    STYLE_NORMAL:       [["zhong", "chong"], ["xin"]],
    STYLE_TONE:         [["zhòng", "chóng"], ["xīn"]],
    STYLE_TONE2:        [["zhong4", "chong2"], ["xin1"]],
    STYLE_TO3NE:        [["zho4ng", "cho2ng"], ["xi1n"]],
    STYLE_INITIALS:     [["zh", "ch"], ["x"]],
    STYLE_FIRST_LETTER: [["z", "c"], ["x"]],
  } ],

  // 英文
  [ "a", {
    STYLE_NORMAL:       [["a"]],
    STYLE_TONE:         [["a"]],
    STYLE_TONE2:        [["a"]],
    STYLE_TO3NE:        [["a"]],
    STYLE_INITIALS:     [["a"]],
    STYLE_FIRST_LETTER: [["a"]],
  } ],
  [ "aa", {
    STYLE_NORMAL:       [["aa"]],
    STYLE_TONE:         [["aa"]],
    STYLE_TONE2:        [["aa"]],
    STYLE_TO3NE:        [["aa"]],
    STYLE_INITIALS:     [["aa"]],
    STYLE_FIRST_LETTER: [["aa"]],
  } ],
  [ "a a", {
    STYLE_NORMAL:       [["a a"]],
    STYLE_TONE:         [["a a"]],
    STYLE_TONE2:        [["a a"]],
    STYLE_TO3NE:        [["a a"]],
    STYLE_INITIALS:     [["a a"]],
    STYLE_FIRST_LETTER: [["a a"]],
  } ],

  // 中英混合
  [ "拼音(pinyin)", {
    STYLE_NORMAL:       [["pin"], ["yin"], ["(pinyin)"]],
    STYLE_TONE:         [["pīn"], ["yīn"], ["(pinyin)"]],
    STYLE_TONE2:        [["pin1"], ["yin1"], ["(pinyin)"]],
    STYLE_TO3NE:        [["pi1n"], ["yi1n"], ["(pinyin)"]],
    STYLE_INITIALS:     [["p"], [""], ["(pinyin)"]],
    STYLE_FIRST_LETTER: [["p"], ["y"], ["(pinyin)"]],
  } ],

  // 中英混合，多音字
  [ "中国(china)", {
    STYLE_NORMAL:       [["zhong"], ["guo"], ["(china)"]],
    STYLE_TONE:         [["zhōng", "zhòng"], ["guó"], ["(china)"]],
    STYLE_TONE2:        [["zhong1", "zhong4"], ["guo2"], ["(china)"]],
    STYLE_TO3NE:        [["zho1ng", "zho4ng"], ["guo2"], ["(china)"]],
    STYLE_INITIALS:     [["zh"], ["g"], ["(china)"]],
    STYLE_FIRST_LETTER: [["z"], ["g"], ["(china)"]],
  } ],
];

describe("pinyin", function() {

  function makeTest(han, opt, style){
    var py = opt[style];
    var single_pinyin = [];
    for(var i = 0, l = py.length; i < l; i++){
      single_pinyin[i] = [py[i][0]];
    }
    var _py = pinyin(han, {style: pinyin[style]});
    it("pinyin(\"" + han + "\", " + style + ") : " +
      JSON.stringify(_py) + " === " + JSON.stringify(single_pinyin), function() {

      expect(_py).to.eql(single_pinyin);
    });
    var _py2 = pinyin(han, {style: pinyin[style], heteronym:true});
    it("pinyin(\"" + han + "\", " + style + ",heteronym) : " +
      JSON.stringify(_py2) + " === " + JSON.stringify(py), function() {

      expect(_py2).to.eql(py);
    });
  }

  for (var i = 0, han, opt, l = cases.length; i < l; i++) {
    han = cases[i][0];
    opt = cases[i][1];
    for(var style in opt){
      makeTest(han, opt, style);
    }
  }
});

describe("pinyin.compare", function() {
  it("我,要,排,序 => 排,我,序,要", function() {
    const data = "我要排序".split("");
    const sortedData = data.sort(pinyin.compare);
    expect(sortedData).to.eql("排我序要".split(""));
  });
});
