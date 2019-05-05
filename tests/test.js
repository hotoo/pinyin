
var expect = require("expect.js");
var pinyin = require("..");

var cases = [

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

  // 多音字，单音词。分词后可以准确识别读音。
  [ "中国", {
    STYLE_NORMAL:       [["zhong"], ["guo"]],
    STYLE_TONE:         {
      normal: [["zhōng", "zhòng"], ["guó"]],
      segment: [["zhōng"], ["guó"]],
    },
    STYLE_TONE2:        {
      normal: [["zhong1", "zhong4"], ["guo2"]],
      segment: [["zhong1"], ["guo2"]],
    },
    STYLE_TO3NE:        {
      normal: [["zho1ng", "zho4ng"], ["guo2"]],
      segment: [["zho1ng"], ["guo2"]],
    },
    STYLE_INITIALS:     [["zh"], ["g"]],
    STYLE_FIRST_LETTER: [["z"], ["g"]],
  } ],
  [ "重心", {
    STYLE_NORMAL:       {
      normal: [["zhong", "chong"], ["xin"]],
      segment: [["zhong"], ["xin"]],
    },
    STYLE_TONE:         {
      normal: [["zhòng", "chóng"], ["xīn"]],
      segment: [["zhòng"], ["xīn"]],
    },
    STYLE_TONE2:        {
      normal: [["zhong4", "chong2"], ["xin1"]],
      segment: [["zhong4"], ["xin1"]],
    },
    STYLE_TO3NE:        {
      normal: [["zho4ng", "cho2ng"], ["xi1n"]],
      segment: [["zho4ng"], ["xi1n"]],
    },
    STYLE_INITIALS:     {
      normal: [["zh", "ch"], ["x"]],
      segment: [["zh"], ["x"]],
    },
    STYLE_FIRST_LETTER: {
      normal: [["z", "c"], ["x"]],
      segment: [["z"], ["x"]],
    },
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
  [ "一 一", {
    STYLE_NORMAL:       [["yi"], [" "], ["yi"]],
    STYLE_TONE:         [["yī"], [" "], ["yī"]],
    STYLE_TONE2:        [["yi1"], [" "], ["yi1"]],
    STYLE_TO3NE:        [["yi1"], [" "], ["yi1"]],
    STYLE_INITIALS:     [[""], [" "], [""]],
    STYLE_FIRST_LETTER: [["y"], [" "], ["y"]],
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

  // 中英混合，多音字，单音词。
  [ "中国(china)", {
    STYLE_NORMAL:       [["zhong"], ["guo"], ["(china)"]],
    STYLE_TONE:         {
      normal: [["zhōng", "zhòng"], ["guó"], ["(china)"]],
      segment: [["zhōng"], ["guó"], ["(china)"]],
    },
    STYLE_TONE2:        {
      normal: [["zhong1", "zhong4"], ["guo2"], ["(china)"]],
      segment: [["zhong1"], ["guo2"], ["(china)"]],
    },
    STYLE_TO3NE:        {
      normal: [["zho1ng", "zho4ng"], ["guo2"], ["(china)"]],
      segment: [["zho1ng"], ["guo2"], ["(china)"]],
    },
    STYLE_INITIALS:     [["zh"], ["g"], ["(china)"]],
    STYLE_FIRST_LETTER: [["z"], ["g"], ["(china)"]],
  } ],

  [ "彷徨", {
    STYLE_NORMAL:       {
      normal: [["pang", "fang"], ["huang"]],
      segment: [["pang"], ["huang"]],
    },
    STYLE_TONE:         {
      normal: [["páng", "fǎng"], ["huáng"]],
      segment: [["páng"], ["huáng"]],
    },
    STYLE_TONE2:        {
      normal: [["pang2", "fang3"], ["huang2"]],
      segment: [["pang2"], ["huang2"]],
    },
    STYLE_TO3NE:        {
      normal: [["pa2ng", "fa3ng"], ["hua2ng"]],
      segment: [["pa2ng"], ["hua2ng"]],
    },
    STYLE_INITIALS:     {
      normal: [["p", "f"], ["h"]],
      segment: [["p"], ["h"]],
    },
    STYLE_FIRST_LETTER: {
      normal: [["p", "f"], ["h"]],
      segment: [["p"], ["h"]],
    },
  } ],

  // 中英混合，多音字，单音词。
  [ "0套价", {
    STYLE_NORMAL:       [["0"], ["tao"], ["jia", "jie"]],
    STYLE_TONE:         [["0"], ["tào"], ["jià", "jiè", "jie"]],
    STYLE_TONE2:        [["0"], ["tao4"], ["jia4", "jie4", "jie"]],
    STYLE_TO3NE:        [["0"], ["ta4o"], ["jia4", "jie4", "jie"]],
    STYLE_INITIALS:     [["0"], ["t"], ["j"]],
    STYLE_FIRST_LETTER: [["0"], ["t"], ["j"]],
  } ],
];

function makeTest(han, opt, style){
  var py = opt[style];
  var pys = py;
  // 有多音字的词组。
  if (py.normal && py.segment) {
    pys = py.segment;
    py = py.normal;
  }
  var single_pinyin = [];
  for(var i = 0, l = py.length; i < l; i++){
    single_pinyin[i] = [py[i][0]];
  }

  // 非多音字模式。
  var _py = pinyin(han, {style: pinyin[style]});
  it("pinyin(\"" + han + "\", " + style + ") : " +
    JSON.stringify(_py) + " === " + JSON.stringify(single_pinyin), function() {

    expect(_py).to.eql(single_pinyin);
  });

  // 普通多音字模式。
  var _py2 = pinyin(han, {style: pinyin[style], heteronym:true});
  it("pinyin(\"" + han + "\", " + style + ",heteronym) : " +
    JSON.stringify(_py2) + " === " + JSON.stringify(py), function() {

    expect(_py2).to.eql(py);
  });

  // 分词多音字模式。
  var _py2s = pinyin(han, {
    style: pinyin[style],
    heteronym: true,
    segment: true,
  });
  it("pinyin(\"" + han + "\", " + style + ",heteronym,segment) : " +
    JSON.stringify(_py2s) + " === " + JSON.stringify(pys), function() {

    expect(_py2s).to.eql(pys);
  });
}

describe("pinyin", function() {

  for (var i = 0, han, opt, l = cases.length; i < l; i++) {
    han = cases[i][0];
    opt = cases[i][1];
    for(var style in opt){
      makeTest(han, opt, style);
    }
  }
});

describe("pinyin.compare", function() {
  it("我,要,排,序 => 序,我,排,要", function() {
    const data = "我要排序".split("");
    const sortedData = data.sort(pinyin.compare);
    expect(sortedData).to.eql("排我序要".split(""));
  });
});
