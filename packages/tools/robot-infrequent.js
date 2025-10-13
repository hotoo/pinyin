// 自动抓取单个不常用汉字拼音。

var ziRobot = require("./robot-zi");

// 常用字集合。
var infrequent = require("./zi/infrequent");

ziRobot.dict(infrequent.split(""));
