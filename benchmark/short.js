var util = require('util');
var memory = process.memoryUsage().rss;

var text = '你好拼音';

console.time('pinyin');
var pinyin = require('../src/pinyin');
pinyin(text);
console.timeEnd('pinyin');
console.log(process.memoryUsage().rss - memory);
