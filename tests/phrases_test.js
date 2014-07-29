
var pinyin = require("../src/pinyin");

var hans = [
  "朝阳",
];

for(var i=0,l=hans.length; i<l; i++){
  console.log(hans[i], pinyin(hans[i], {heteronym:true}));
}
