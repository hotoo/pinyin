"use strict";

const pinyin = require("../index");
const jieba = require("nodejieba");

console.log(pinyin("重庆大学", {segment: true}));
console.log(pinyin("重庆大学", {
    heteronym: true,              // 启用多音字模式
    segment: true,                 // 启用分词，以解决多音字问题。
}));

// test pinyin-node segment 漯(luo)河
console.log(pinyin("漯河", {segment: true}));
console.log(pinyin("漯河", {
    heteronym: true,              // 启用多音字模式
    segment: true,                 // 启用分词，以解决多音字问题。
}));


const han = "女流氓";
const jb = jieba.cutSmall(han, 4);
console.log(han, jb);
