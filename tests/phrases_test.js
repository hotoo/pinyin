
const pinyin = require("../lib/");

const hans = [
  "中国(china)",
  "彷徨",
];

hans.forEach((han) => {
  console.log(han, pinyin(han, { heteronym: true, segment: true }));
});
