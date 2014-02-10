
var dictAll = require("./zi/all");
var dictFrequent = require("./zi/frequent");
var dictFrequent2 = require("./zi/frequent2");

var source_frequent = "[" + dictFrequent + dictFrequent2 + "]";

var RE_FREQUENT = new RegExp(source_frequent, "g");

var dictInfrequent = dictAll.replace(RE_FREQUENT, "");

console.log('module.exports = "' + dictInfrequent + '";');

module.exports = dictInfrequent;
