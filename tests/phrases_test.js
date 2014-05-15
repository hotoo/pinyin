/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/02/02
 */

var pinyin = require("../src/pinyin.js");
var S = require("simplebig")

var hans = [
  "中心思想",
  "中弹受伤",
  "重心不稳",
  "影碟重重",
  "冒顿单于",
  "这个没有",
  "狗出没注意",
  "惊天地泣鬼神"
];

for(var i=0,l=hans.length; i<l; i++){
  console.log(hans[i], pinyin(hans[i]));
}

console.log(S.t2s("乳臭未乾"));
console.log(S.t2s("旁徵博引"));
