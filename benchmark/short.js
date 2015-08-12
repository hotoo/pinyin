var util = require('util');
var memory = process.memoryUsage().rss;

var text = '你好拼音';

var pinyin = require('../src/pinyin');
console.time('pinyin');
pinyin(text);
console.timeEnd('pinyin');
console.log(process.memoryUsage().rss - memory);
