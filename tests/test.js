/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/27
 */

var assert = require("assert");
var pinyin = require("../src/pinyin");

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

var hans1 = "天将将大任于斯人也";
var hans2 = "在地球重力的影响下，重心不稳。";

console.log(pinyin(hans1).join(" "));
console.log(pinyin(hans2).join(","));
console.log(pinyin(hans2, {
  style: pinyin.STYLE_TONE
}).join(" "));
console.log(pinyin(hans2, {
  style: pinyin.STYLE_NORMAL
}).join(" "));
console.log("TONE2:", pinyin(hans2, {
  style: pinyin.STYLE_TONE2
}));
console.log(pinyin(hans2, {
  delimiter: ",",
  style: pinyin.STYLE_INITIALS
}));

console.log(pinyin("重", {
  delimiter: " ",
  heteronym: true
}));
console.log(pinyin("拼个南呵", {
  delimiter: " ",
  style: pinyin.STYLE_TONE,
  heteronym: true
}));
console.log(pinyin("拼个南呵", {
  delimiter: " ",
  style: pinyin.STYLE_FIRST_LETTER,
  heteronym: true
}));
    console.log(pinyin("中心"));
    console.log(pinyin("中心", {
      heteronym: true               // 多音字
    }));
    console.log(pinyin("中心", {
      style: pinyin.STYLE_INITIALS, // 风格
      heteronym: true               // 多音字
    }));

console.log(pinyin("思", {
  heteronym: true
}));

//assert.equal(pinyin.convert(hans, true, ""), "PinYin");
