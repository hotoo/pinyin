import pinyin, { compare, compact, IPinyinStyle } from "../index";

describe("pinyin() without param", function() {
  it("pinyin() => []", function() {
    // @ts-ignore
    expect(pinyin()).toEqual([]);
  });
});

const cases: any[] = [

  // 单音字
  [ "我", {
    STYLE_NORMAL:       [["wo"]],
    STYLE_PASSPORT:     [["WO"]],
    STYLE_TONE:         [["wǒ"]],
    STYLE_TONE2:        [["wo3"]],
    STYLE_TO3NE:        [["wo3"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["w"]],
  } ],

  [ "〇", {
    STYLE_NORMAL:       [["ling", "xing"]],
    STYLE_PASSPORT:     [["LING", "XING"]],
    STYLE_TONE:         [["líng", "xīng"]],
    STYLE_TONE2:        [["ling2", "xing1"]],
    STYLE_TO3NE:        [["li2ng", "xi1ng"]],
    STYLE_INITIALS:     [["l", "x"]],
    STYLE_FIRST_LETTER: [["l", "x"]],
  } ],

  // 多音字
  [ "中", {
    STYLE_NORMAL:       [["zhong"]],
    STYLE_PASSPORT:     [["ZHONG"]],
    STYLE_TONE:         [["zhōng", "zhòng"]],
    STYLE_TONE2:        [["zhong1", "zhong4"]],
    STYLE_TO3NE:        [["zho1ng", "zho4ng"]],
    STYLE_INITIALS:     [["zh"]],
    STYLE_FIRST_LETTER: [["z"]],
  } ],

  // 元音字
  ["爱", {
    STYLE_NORMAL:       [["ai"]],
    STYLE_PASSPORT:     [["AI"]],
    STYLE_TONE:         [["ài"]],
    STYLE_TONE2:        [["ai4"]],
    STYLE_TO3NE:        [["a4i"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["a"]],
  } ],
  ["啊", {
    STYLE_NORMAL:       [["a"]],
    STYLE_PASSPORT:     [["A"]],
    STYLE_TONE:         [["ā", "á", "ǎ", "à", "a"]],
    STYLE_TONE2:        [["a1", "a2", "a3", "a4", "a"]],
    STYLE_TO3NE:        [["a1", "a2", "a3", "a4", "a"]],
    STYLE_INITIALS:     [[""]],
    STYLE_FIRST_LETTER: [["a"]],
  } ],

  // YU
  ["吕", {
    STYLE_NORMAL:       [["lv"]],
    STYLE_PASSPORT:     [["LYU"]],
    STYLE_TONE:         [["lǚ"]],
    STYLE_TONE2:        [["lv3"]],
    STYLE_TO3NE:        [["lv3"]],
    STYLE_INITIALS:     [["l"]],
    STYLE_FIRST_LETTER: [["l"]],
  } ],

  // 单音词
  [ "我是谁", {
    STYLE_NORMAL:       [["wo"], ["shi"], ["shui"]],
    STYLE_PASSPORT:     [["WO"], ["SHI"], ["SHUI"]],
    STYLE_TONE:         [["wǒ"], ["shì"], ["shuí"]],
    STYLE_TONE2:        [["wo3"], ["shi4"], ["shui2"]],
    STYLE_TO3NE:        [["wo3"], ["shi4"], ["shui2"]],
    STYLE_INITIALS:     [[""], ["sh"], ["sh"]],
    STYLE_FIRST_LETTER: [["w"], ["s"], ["s"]],
  } ],

  // 多音字，单音词。分词后可以准确识别读音。
  [ "中国", {
    STYLE_NORMAL:       [["zhong"], ["guo"]],
    STYLE_PASSPORT:     [["ZHONG"], ["GUO"]],
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
    STYLE_PASSPORT:     {
      normal: [["ZHONG", "CHONG"], ["XIN"]],
      segment: [["ZHONG"], ["XIN"]],
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
    STYLE_PASSPORT:     [["a"]],
    STYLE_TONE:         [["a"]],
    STYLE_TONE2:        [["a"]],
    STYLE_TO3NE:        [["a"]],
    STYLE_INITIALS:     [["a"]],
    STYLE_FIRST_LETTER: [["a"]],
  } ],
  [ "aa", {
    STYLE_NORMAL:       [["aa"]],
    STYLE_PASSPORT:     [["aa"]],
    STYLE_TONE:         [["aa"]],
    STYLE_TONE2:        [["aa"]],
    STYLE_TO3NE:        [["aa"]],
    STYLE_INITIALS:     [["aa"]],
    STYLE_FIRST_LETTER: [["aa"]],
  } ],
  [ "a a", {
    STYLE_NORMAL:       [["a a"]],
    STYLE_PASSPORT:     [["a a"]],
    STYLE_TONE:         [["a a"]],
    STYLE_TONE2:        [["a a"]],
    STYLE_TO3NE:        [["a a"]],
    STYLE_INITIALS:     [["a a"]],
    STYLE_FIRST_LETTER: [["a a"]],
  } ],
  [ "一 一", {
    STYLE_NORMAL:       [["yi"], [" "], ["yi"]],
    STYLE_PASSPORT:     [["YI"], [" "], ["YI"]],
    STYLE_TONE:         [["yī"], [" "], ["yī"]],
    STYLE_TONE2:        [["yi1"], [" "], ["yi1"]],
    STYLE_TO3NE:        [["yi1"], [" "], ["yi1"]],
    STYLE_INITIALS:     [[""], [" "], [""]],
    STYLE_FIRST_LETTER: [["y"], [" "], ["y"]],
  } ],

  // 中英混合
  [ "拼音(pinyin)", {
    STYLE_NORMAL:       [["pin"], ["yin"], ["(pinyin)"]],
    STYLE_PASSPORT:     [["PIN"], ["YIN"], ["(pinyin)"]],
    STYLE_TONE:         [["pīn"], ["yīn"], ["(pinyin)"]],
    STYLE_TONE2:        [["pin1"], ["yin1"], ["(pinyin)"]],
    STYLE_TO3NE:        [["pi1n"], ["yi1n"], ["(pinyin)"]],
    STYLE_INITIALS:     [["p"], [""], ["(pinyin)"]],
    STYLE_FIRST_LETTER: [["p"], ["y"], ["(pinyin)"]],
  } ],

  // 中英混合，多音字，单音词。
  [ "中国(china)", {
    STYLE_NORMAL:       [["zhong"], ["guo"], ["(china)"]],
    STYLE_PASSPORT:     [["ZHONG"], ["GUO"], ["(china)"]],
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
    STYLE_PASSPORT:     {
      normal: [["PANG", "FANG"], ["HUANG"]],
      segment: [["PANG"], ["HUANG"]],
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
    STYLE_PASSPORT:     [["0"], ["TAO"], ["JIA", "JIE"]],
    STYLE_TONE:         [["0"], ["tào"], ["jià", "jiè", "jie"]],
    STYLE_TONE2:        [["0"], ["tao4"], ["jia4", "jie4", "jie"]],
    STYLE_TO3NE:        [["0"], ["ta4o"], ["jia4", "jie4", "jie"]],
    STYLE_INITIALS:     [["0"], ["t"], ["j"]],
    STYLE_FIRST_LETTER: [["0"], ["t"], ["j"]],
  } ],

  // 其他
  [ "女流氓", {
    STYLE_NORMAL:       {
      normal: [["nv", "ru"], ["liu"], ["mang", "meng"]],
      segment: [["nv", "ru"], ["liu"], ["mang"]],
    },
    STYLE_PASSPORT:       {
      normal: [["NYU", "RU"], ["LIU"], ["MANG", "MENG"]],
      segment: [["NYU", "RU"], ["LIU"], ["MANG"]],
    },
    STYLE_TONE:         {
      normal: [["nǚ", "rǔ"], ["liú"], ["máng", "méng"]],
      segment: [["nǚ", "rǔ"], ["liú"], ["máng"]],
    },
    STYLE_TONE2:        {
      normal: [["nv3", "ru3"], ["liu2"], ["mang2", "meng2"]],
      segment: [["nv3", "ru3"], ["liu2"], ["mang2"]],
    },
    STYLE_TO3NE:        {
      normal: [["nv3", "ru3"], ["liu2"], ["ma2ng", "me2ng"]],
      segment: [["nv3", "ru3"], ["liu2"], ["ma2ng"]],
    },
    STYLE_INITIALS:     {
      normal: [["n", "r"], ["l"], ["m"]],
      segment: [["n", "r"], ["l"], ["m"]],
    },
    STYLE_FIRST_LETTER: {
      normal: [["n", "r"], ["l"], ["m"]],
      segment: [["n", "r"], ["l"], ["m"]],
    },
  } ],
];

describe("姓名模式", function() {
  it("复姓", function() {
    expect(pinyin("南宫世家")).toEqual([["nán"], ["gōng"], ["shì"], ["jiā"]]);
    expect(pinyin("南宫世家", { mode: "SURNAME"})).toEqual([["nán"], ["gōng"], ["shì"], ["jiā"]]);

    expect(pinyin("查某说：您是万俟先生？", { mode: "NORMAL"})).toEqual([["chá"], ["mǒu"], ["shuō"], ["："], ["nín"], ["shì"], ["wàn"], ["sì"], ["xiān"], ["shēng"], ["？"]]);
    expect(pinyin("查某说：您是万俟先生？", { mode: "SURNAME"})).toEqual([["zhā"], ["mǒu"], ["shuō"], ["："], ["nín"], ["shì"], ["mò"], ["qí"], ["xiān"], ["shēng"], ["？"]]);
  });
  it("单姓", function() {
    expect(pinyin("华夫人", { mode: "NORMAL"})).toEqual([["huá"], ["fū"], ["rén"]]);
    expect(pinyin("华夫人", { mode: "SURNAME"})).toEqual([["huà"], ["fū"], ["rén"]]);
    expect(pinyin("吕布", { mode: "SURNAME", style: "passport" })).toEqual([["LYU"], ["BU"]]);
  });
});


function getPinyinStyle(styleName: string): IPinyinStyle {
  return styleName.replace(/^STYLE_/, "") as IPinyinStyle;
}
function makeTest(han: string, opt: any, style: string){
  let py = opt[style];
  let pys = py;
  // 有多音字的词组。
  if (py.normal && py.segment) {
    pys = py.segment;
    py = py.normal;
  }
  const single_pinyin = [];
  for(let i = 0, l = py.length; i < l; i++){
    single_pinyin[i] = [py[i][0]];
  }

  // 非多音字模式。
  const _py = pinyin(han, {style: getPinyinStyle(style)});
  it("pinyin(\"" + han + "\", " + style + ") : " +
    JSON.stringify(_py) + " === " + JSON.stringify(single_pinyin), function() {

    expect(_py).toEqual(single_pinyin);
  });

  // 普通多音字模式。
  const _py2 = pinyin(han, {style: getPinyinStyle(style), heteronym:true});
  it("pinyin(\"" + han + "\", " + style + ",heteronym) : " +
    JSON.stringify(_py2) + " === " + JSON.stringify(py), function() {

    expect(_py2).toEqual(py);
  });

  // 分词多音字模式。
  const _py2s = pinyin(han, {
    style: getPinyinStyle(style),
    heteronym: true,
    segment: true,
  });
  it("pinyin(\"" + han + "\", " + style + ",heteronym,segment) : " +
    JSON.stringify(_py2s) + " === " + JSON.stringify(pys), function() {

    expect(_py2s).toEqual(pys);
  });
}

describe("pinyin", function() {

  for (let i = 0, l = cases.length; i < l; i++) {
    const han = cases[i][0];
    const opt: Record<string, string[][]> = cases[i][1];
    for(const style in opt) {
      makeTest(han, opt, style);
    }
  }
});

describe("pinyin.compare", function() {
  it("我,要,排,序 => 序,我,排,要", function() {
    const data = "我要排序".split("");
    const sortedData = data.sort(compare);
    expect(sortedData).toEqual("排我序要".split(""));
  });
});

describe("pinyin group", function() {
  it("groups segments", function () {
    const han = "我喜欢你";
    const py = pinyin(han, {segment: true, group: true, heteronym: true});
    expect(py).toEqual([["wǒ"], ["xǐhuān"], ["nǐ"]]);
  });

  it("groups segments with heteronyms", function() {
    const han = "我都喜欢朝阳";
    const py = pinyin(han, {segment: true, group: true, heteronym: true});
    expect(py).toEqual([["wǒ"], ["dū", "dōu"], ["xǐhuān"], ["zhāoyáng", "cháoyáng"]]);
  });

  it("groups segments without heteronyms", function() {
    const han = "我都喜欢朝阳";
    const py = pinyin(han, {segment: true, group: true, heteronym: false});
    expect(py).toEqual([["wǒ"], ["dū"], ["xǐhuān"], ["zhāoyáng"]]);
  });

  it("落叶落下着落", function() {
    const han = "落叶落下";
    const py = pinyin(han, {segment: true, group: true, heteronym: false});
    expect(py).toEqual([["luòyè"], ["làxià"]]);
  });
});

describe("pinyin compact", function() {
  it("compact without heternonyms, normal style", function() {
    const han = "还钱";
    const py = pinyin(han, { style: pinyin.STYLE_NORMAL, segment: "@node-rs/jieba", group: true, heteronym: false, compact: true });
    expect(py).toEqual([["huan", "qian"]]);
  });
  it("compact with heternonyms, normal style", function() {
    const han = "还钱";
    const py = pinyin(han, { style: pinyin.STYLE_NORMAL, segment: "@node-rs/jieba", group: true, heteronym: true, compact: true });
    expect(py).toEqual([["huan", "qian"], ["hai", "qian"]]);
  });

  it("compact with heternonyms, normal style", function() {
    const han = "还钱";
    const py = pinyin(han, { style: "NORMAL", segment: "segmentit", group: true, heteronym: true });
    expect(compact(py)).toEqual([["huan", "qian"], ["hai", "qian"]]);
    expect(pinyin.compact(py)).toEqual([["huan", "qian"], ["hai", "qian"]]);
  });

  it("compact with heternonyms, first letter, group false", function() {
    const han = "还钱";
    const py = pinyin(han, { style: "FIRST_LETTER", segment: "nodejieba", group: false, heteronym: true });
    expect(compact(py)).toEqual([["h", "q"]]);
    expect(pinyin.compact(py)).toEqual([["h", "q"]]);
  });

  it("compact with heternonyms, group true", function() {
    const han = "还钱";
    const py = pinyin(han, {segment: true, group: true, heteronym: true});
    expect(compact(py)).toEqual([["huán", "qián"], ["hái", "qián"]]);
    expect(pinyin.compact(py)).toEqual([["huán", "qián"], ["hái", "qián"]]);
  });

  it("compact with heternonyms, many words", function() {
    const han = "我们都爱朝阳";
    const py = pinyin(han, { style: "FIRST_LETTER", heteronym: true, compact: true });
    expect(py).toEqual([["w", "m", "d", "a", "z", "y"], ["w", "m", "d", "a", "c", "y"]]);
  });

  it("行不行 compact without heternonyms, normal style", function() {
    const han = "行不行";
    const py = pinyin(han, { style: pinyin.STYLE_NORMAL, segment: true, heteronym: false, compact: true });
    expect(py).toEqual([["xing", "bu", "xing"]]);
  });
});
