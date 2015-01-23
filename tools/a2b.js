/*jshint node:true,strict:false*/
var fs = require('fs');
var path = require('path');
var root = path.join(__dirname, '..');

var dict = require(path.join(root,'./tools/dict.js'));

var result = [];

for(var ascii in dict){
	result.push(Buffer.concat([
		new Buffer(getBufferArr(+ascii,3)),
		new Buffer(dict[ascii] + '\n')
	]));
}

fs.writeFileSync(path.join(root,'data/dict.bin'),Buffer.concat(result));

function getBufferArr(number,bytes){
	var ret = [];
	var str = number.toString(16);
	while(str.length < bytes*2){
		str = '0'+str;
	}
	if(str.length > bytes*2){
		str = str.substr(str.length-bytes*2,bytes*2);
	}
	for(var i=0;i<bytes;i++){
		ret.push(parseInt(str.substr(i*2,2),16));
	}
	return ret;
}