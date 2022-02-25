const nodejieba = require("nodejieba");
const rustjieba = require("@node-rs/jieba");
console.log('----debug', rustjieba);

const words = "我的名字叫做江大桥，田亮";
console.log('nodejieba: ', nodejieba.tag(words, 4));
console.log('rustjieba: ', rustjieba.tag(words));
