// 自动抓取单个常用汉字拼音。

var ziRobot = require("./robot-zi");

// 常用字集合。
var frequent = require("./zi/frequent");
var frequent2 = require("./zi/frequent2");

ziRobot.dict((frequent + frequent2).split(""));
