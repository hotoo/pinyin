/*jshint node:true,strict:false*/
var options = {};
var defaultOptions = {
  heteronym:false,
  style:'tone'
};

var extendOptions = function(ops){
  if(!ops) ops = {};
  for(var key in defaultOptions){
    if(typeof ops[key] === 'undefined'){
      options[key] = defaultOptions[key];
    }else{
      options[key] = ops[key];
    }
  }
};

// 声母表。
var INITIALS = 'zh,ch,sh,b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,z,c,s,yu,y,w'.split(',');
// 韵母表。
var FINALS = 'ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v'.split(',');

// 带音标字符。
var PHONETIC_SYMBOL = {
  ā: 'a1',
  á: 'a2',
  ǎ: 'a3',
  à: 'a4',
  ē: 'e1',
  é: 'e2',
  ě: 'e3',
  è: 'e4',
  ō: 'o1',
  ó: 'o2',
  ǒ: 'o3',
  ò: 'o4',
  ī: 'i1',
  í: 'i2',
  ǐ: 'i3',
  ì: 'i4',
  ū: 'u1',
  ú: 'u2',
  ǔ: 'u3',
  ù: 'u4',
  ü: 'v0',
  ǘ: 'v2',
  ǚ: 'v3',
  ǜ: 'v4',
  ń: 'n2',
  ň: 'n3',
  '': 'm2'
};

var re_phonetic_symbol_source = '';
for(var k in PHONETIC_SYMBOL){
    re_phonetic_symbol_source += k;
}
var RE_PHONETIC_SYMBOL = new RegExp('(['+re_phonetic_symbol_source+'])', 'g');
var RE_TONE2 = /([aeoiuvnm])([0-4])$/;

// 格式化为声母(Initials)、韵母(Finals)。
// @param {String}
// @return {String}
var getInitials = function(pinyin){
  for(var i=0,l=INITIALS.length; i<l; i++){
    if(pinyin.indexOf(INITIALS[i]) === 0){
      return INITIALS[i];
    }
  }
  pinyin = getNormal(pinyin);
  for(var i=0,l=FINALS.length; i<l; i++){
    if(pinyin.indexOf(FINALS[i]) === 0){
      return FINALS[i];
    }
  }
  return '';
};

var getNormal = function(pinyin){
  return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1_phonetic){
    return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, '$1');
  });
};

var stylePy = function(pyArr){
  var ret;
  switch(options.style){
    // 带声调，默认值
    case 'tone':
      ret = pyArr;
      break;
    // 使用数字作为声调
    case 'toneWithNumber':
      ret = pyArr.map(function(pyItem){
        var tone;
        var py = pyItem.replace(RE_PHONETIC_SYMBOL, function($0, $1){
          // 声调数值。
          tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, '$2');
          return PHONETIC_SYMBOL[$1].replace(RE_TONE2, '$1');
        });
        return py + tone;
      });
      break;
    // 不带声调
    case 'normal':
      ret = pyArr.map(function(pyItem){
        return getNormal(pyItem);
      });
      break;
    // 声母
    case 'initials':
      ret = pyArr.map(function(pyItem){
        return getInitials(pyItem);
      });
      break;
    // 首字母
    case 'firstLetter':
      ret = pyArr.map(function(pyItem){
        return pyItem.substr(0,1);
      });
      break;
  }
  return ret;
};

var getPinyin = function(word){
  var fs = require('fs');
  var path = require('path');
  var searchFile = require('./searchfile');

  var filePath = path.join(__dirname, '../data/dict.bin');
  var fileSize = fs.statSync(filePath).size;
  var offset = fileSize / 2;
  // console.log('init file offset',offset);
  var min = 0;
  var max = fileSize;
  var fd = fs.openSync(filePath,'r');
  var wordAscii = word.charCodeAt(0);
  var buffer = searchFile(fd,min,max,function(offset,isReverse){
    // console.log('adjust input offset %d',offset);
    var tmpBuffer = new Buffer(1);
    if(offset > 1){
      fs.readSync(fd,tmpBuffer,0,1,offset-1);
    }else{
      return offset;
    }
    if(isReverse){
      offset--;
      tmpBuffer[0] = 0;
      while(+tmpBuffer[0] !== 10 && offset > min){
        fs.readSync(fd,tmpBuffer,0,1,--offset);
      }
      offset++;
    }else{
      while(+tmpBuffer[0] !== 10 && offset <= max){
        fs.readSync(fd,tmpBuffer,0,1,offset++);
      }
    }
    // console.log('adjusted output offset',offset);
    return offset;
  },function(buffer){
    return buffer.length > 2 && +buffer[buffer.length - 1] === 10;
  },function(buffer){
    var ascii = buffer[0]*256*256 + buffer[1]*256 + buffer[2];
    if(ascii === wordAscii){
      return 0;
    }else if(ascii < wordAscii){
      return -1;
    }else{
      return 1;
    }
  },offset);
  fs.closeSync(fd);
  if(buffer){
    buffer = buffer.slice(3);
    var pinyin = buffer.toString('utf-8').replace(/\n/g,'').split(',');
    return pinyin;
  }
};

/** 
 * @param {String} hans 要转为拼音的目标字符串（汉字）。
 * @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
 * @return {Array} 返回的拼音列表。
 **/
var pinyin = function(words, ops){

  if(typeof words !== 'string') return [];

  extendOptions(ops);
  var pys = [];
  var nohans = '';
  words.split('').forEach(function(word){
    var py = getPinyin(word);
    if(!py){
      nohans += word;
    }else{
      if(nohans){
        pys.push([nohans]);
        nohans = '';
      }
      if(!options.heteronym){
        py = py.slice(0,1);
      }
      pys.push(stylePy(py));
    }
  });
  // 清理最后的非中文字符串。
  if(nohans.length > 0){
    pys.push([nohans]);
  }

  return pys;
};

module.exports = pinyin;



