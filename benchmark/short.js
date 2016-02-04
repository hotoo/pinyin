var memory = process.memoryUsage().rss;

var text = "你好拼音";

var pinyin = require("../web-pinyin");
console.time("pinyin");
pinyin(text);
console.timeEnd("pinyin");
console.log(process.memoryUsage().rss - memory);
