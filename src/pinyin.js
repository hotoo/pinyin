/*jshint node:true,strict:false*/
var PINYIN_DICT = require('./dict-zi');

// 单字拼音转换。
// @param {String} han, 单个汉字
// @return {Array} 返回拼音列表，多音字会有多个拼音项。
function single_pinyin(han, options){

  if('string' !== typeof han){return [];}
  if(han.length !== 1){
    return single_pinyin(han.charAt(0), options);
  }

  var hanCode = han.charCodeAt(0);

  if(!PINYIN_DICT[hanCode]){return [han];}

  var pys = PINYIN_DICT[hanCode].split(',');
  if(!options.heteronym){
    return [pys[0]];
  }

  // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
  var py_cached = {};
  var pinyins = [];
  for(var i=0,py,l=pys.length; i<l; i++){
    py = pys[i];
    if(py_cached.hasOwnProperty(py)){continue;}
    py_cached[py] = py;

    pinyins.push(py);
  }
  return pinyins;
}

// @param {String} hans 要转为拼音的目标字符串（汉字）。
// @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
// @return {Array} 返回的拼音列表。
function pinyin(hans, options){

  if('string' !== typeof hans){return [];}

  if(!options) options={};

  var pys = [];
  var nohans = '';


  for(var i=0; i<hans.length; i++){
    var word = hans[i];
    var charCode = word.charCodeAt(0);
    if(PINYIN_DICT[charCode]){
      // ends of non-chinese words.
      if(nohans.length > 0){
        pys.push([nohans]);
        nohans = ''; // reset non-chinese words.
      }
      pys.push(single_pinyin(hans[i], options));
    }else{
      nohans += word;
    }
  }

  // 清理最后的非中文字符串。
  if(nohans.length > 0){
    pys.push([nohans]);
    nohans = ''; // reset non-chinese words.
  }
  return pys;
}

module.exports = pinyin;
