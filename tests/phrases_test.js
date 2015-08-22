
var pinyin = require("../src/pinyin");

var hans = [
  "中国(china)",
];

for(var i = 0, l = hans.length; i < l; i++){
  console.log(hans[i], pinyin(hans[i], { heteronym: true }));
}
