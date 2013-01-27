/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/27
 */

var assert = require("assert");
var pinyin = require("../src/pinyin");
var pinyin_dict = require("../src/pinyin-dict");
pinyin.setDictionary(pinyin_dict);

var hans = "天将将大任于斯人也";
var hans = "拼音";

console.log(pinyin.convert(hans));
assert.equal(pinyin.convert(hans), [["Pin","Yin"]]);
assert.equal(pinyin.convert(hans, true, ""), "PinYin");
