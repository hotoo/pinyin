/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/28
 */

var dict = require("./dict2");

var phonetics_cached = {};
var phonetics = "";
var s_phonetics = "";
for(var py in dict){
  phonetics += py;
}
phonetics = phonetics.replace(/[a-zA-Z]/g, "");
phonetics = phonetics.split("");
for(var i=0,l=phonetics.length; i<l; i++){
  if(phonetics_cached.hasOwnProperty(phonetics[i])){continue;}
  phonetics_cached[phonetics[i]] = phonetics[i];
  s_phonetics += phonetics[i];
}

console.log(s_phonetics);
