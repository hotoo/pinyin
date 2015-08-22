
var memory = process.memoryUsage().rss;
var Benchmark = require("benchmark");
var pinyin = require("../");

var pkg = require("../package.json");
console.log(pkg.name + "@" + pkg.version);

function formatNunber(num){
  return String(num).replace(/(\d)(?=(\d{3})+$)/g, "$1,");
}

var suite = new Benchmark.Suite();

suite.add("pinyin 中文", function(){
  return pinyin("中文");
})
.add("pinyin --heteronym 中文", function(){
  return pinyin("中文", {
    heteronym: true,
  });
})
.add("pinyin --style NORMAL --heteronym 中文", function(){
  return pinyin("中文", {
    heteronym: true,
    style: "NORMAL",
  });
})
.add("pinyin --segment 中文", function(){
  return pinyin("中文", {
    segment: true,
  });
})
.add("pinyin --segment --heteronym 中文", function(){
  return pinyin("中文", {
    heteronym: true,
    segment: true,
  });
})
.add("pinyin --segment --heteronym --style NORMAL 中文", function(){
  return pinyin("中文", {
    heteronym: true,
    segment: true,
    style: "NORMAL",
  });
})
.on("cycle", function(event) {
  var mem = process.memoryUsage().rss;
  console.log(String(event.target) + " memory usage: %s bytes.", formatNunber(mem - memory));
  memory = mem;
})
.on("complete", function() {
  console.log("Fastest is " + this.filter("fastest").pluck("name"));
})
.run();
