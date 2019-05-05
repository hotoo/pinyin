/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/28
 */

var dict = require("./dict/dict-zi-frequent");

var comboed = {};
for(var han in dict){

  if(!dict.hasOwnProperty(han)){continue;}

  // 方案一：先拆分多音字的拼音，单独进行合并。
  //         多音字会被拆分到多个拼音中去，且无法调整多音字常用拼音的排序。
  //var pys = dict[han].split(",");
  //for(var i=0,py,l=pys.length; i<l; i++){
    //py = pys[i];
    //if(!comboed.hasOwnProperty(py)){
      //comboed[py] = han;
    //}else{
      //comboed[py] += han;
    //}
  //}


  // 方案二：不拆分多音字的拼音，直接进行合并。
  var py = dict[han];
  if(!comboed.hasOwnProperty(py)){
    comboed[py] = han;
  }else{
    comboed[py] += han;
  }
}

console.log("module.exports = " + JSON.stringify(comboed)
    .replace("{", "{\n")
    .replace(/","/g, '",\n"')
    .replace("}", "\n};")
  );
