/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/28
 */

var dict = require("./pinyin-dict");

var comboed = {};
for(var han in dict){
  if(!dict.hasOwnProperty(han)){continue;}
  var pys = dict[han].split(",");
  for(var i=0,py,l=pys.length; i<l; i++){
    py = pys[i];
    if(!comboed.hasOwnProperty(py)){
      comboed[py] = han;
    }else{
      comboed[py] += han;
    }
  }
}

console.log(JSON.stringify(comboed));
