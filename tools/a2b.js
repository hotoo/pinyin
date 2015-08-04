/*jshint node:true,strict:false*/
var fs = require('fs');
var path = require('path');
var root = path.join(__dirname, '..');

var dict = require('./dict/dict-zi');

var START = 0x3400;
var END = 0x2A599;
var result = [];

for (var hanCode = START; hanCode < END; hanCode++) {
  if (!dict[hanCode]) {
    //console.log(hanCode);
    continue;
  }
	result.push(Buffer.concat([
		new Buffer(getBufferArr(hanCode,3)),
		new Buffer(dict[hanCode] + '\n')
	]));
}

fs.writeFileSync(path.join(root,'data/dict.bin'),Buffer.concat(result));

function right (str, length) {
  if (str.length <= length) {
    return str;
  }
  return str.substring(str.length - length);
}

function getBufferArr(number,bytes){
	var ret = [];
	var str = number.toString(16);
  // 超出长度后，取后面部分。
	if(str.length > bytes*2){
    str = right(str, bytes * 2);
    console.log(str);
	} else { // 不足长度补 0。
    str = right('0'.repeat(bytes * 2) + str, bytes * 2);
  }
  // 将每个数字转成 16 进制存储。
	for(var i=0;i<bytes;i++){
		ret.push(parseInt(str.substr(i*2,2),16));
	}
	return ret;
}
