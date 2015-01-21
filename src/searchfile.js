/*jshint node:true,strict:false*/
var fs = require('fs');
var lastMin;
var lastMax;
var reverse = false;
var searchFile = function(fd,min,max,offsetFunc,bufferFunc,assetFunc,offset){
	if(typeof offset === 'undefined' || offset >= max){
		offset = (max+min)/2;
		// console.log('search no offset, min %d , max %d, offset %d',min,max,offset);
	}else{
		// console.log('search with offset, min %d , max %d, offset %d',min,max,offset);
	}
	offset = offsetFunc(Math.floor(offset));
	if(lastMin === min && lastMax === max){
		if(!reverse){
			offset = offsetFunc(Math.floor(offset),true);
			reverse = true;
		}else{
			reverse = false;
			return null;
		}
	}else{
		reverse = false;
	}
	lastMin = min;
	lastMax = max;
	var buffer = new Buffer(0);
	var tmpOffset = offset;
	while(!bufferFunc(buffer)){
		var tmpBuffer = new Buffer(1);
		fs.readSync(fd,tmpBuffer,0,1,tmpOffset++);
		buffer = Buffer.concat([buffer,tmpBuffer]);
	}
	var assetResult = assetFunc(buffer);
	if(assetResult === 0){
		lastMin = undefined;
		lastMax = undefined;
		reverse = false;
		return buffer;
	}else if(assetResult === 1){
		max = offset;
		return searchFile(fd,min,max,offsetFunc,bufferFunc,assetFunc);
	}else if(assetResult === -1){
		min = offset;
		return searchFile(fd,min,max,offsetFunc,bufferFunc,assetFunc);
	}
};
module.exports = searchFile;