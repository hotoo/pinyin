
var Benchmark = require('benchmark');
var pinyin = require('../');

var pkg = require('../package.json');
console.log(pkg.name + '@' + pkg.version);

var suite = new Benchmark.Suite();

suite.add('pinyin 中国', function(){
  return pinyin('中国');
})
.add('pinyin --heteronym 中国', function(){
  return pinyin('中国', {
    heteronym: true,
  });
})
.add('pinyin --style NORMAL --heteronym 中国', function(){
  return pinyin('中国', {
    heteronym: true,
    style: 'NORMAL',
  });
})
.add('pinyin --segment 中国', function(){
  return pinyin('中国', {
    segment: true,
  });
})
.add('pinyin --segment --heteronym 中国', function(){
  return pinyin('中国', {
    heteronym: true,
    segment: true,
  });
})
.add('pinyin --segment --heteronym --style NORMAL 中国', function(){
  return pinyin('中国', {
    heteronym: true,
    segment: true,
    style: 'NORMAL',
  });
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run();
