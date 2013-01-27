/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/27
 */

var assert = require("assert");
var pinyin = require("../src/pinyin");

var hans = "将将";

console.log(pinyin(hans, false, ""));
//assert.equal(pinyin.convert(hans), [["Pin","Yin"]]);
//assert.equal(pinyin.convert(hans, true, ""), "PinYin");
