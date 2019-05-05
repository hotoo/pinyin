
var expect = require("expect.js");
var child_process = require("child_process");

var testcases = [
  {
    command: "pinyin 中国",
    stdout: "zhōng guó",
  },
  {
    command: "pinyin -h 中国",
    stdout: "zhōng,zhòng guó",
  },
  {
    command: "pinyin -hS 中国",
    stdout: "zhōng guó",
  },
  {
    command: "pinyin -S 中国",
    stdout: "zhōng guó",
  },
  {
    command: "pinyin 重心",
    stdout: "zhòng xīn",
  },
  {
    command: "pinyin 重复",
    stdout: "zhòng fù",
  },
  {
    command: "pinyin -h 重复",
    stdout: "zhòng,chóng fù",
  },
  {
    command: "pinyin -hS 重复",
    stdout: "chóng fù",
  },
  {
    command: "pinyin -hS -s NORMAL 重复",
    stdout: "chong fu",
  },
  {
    command: "pinyin -s INITIALS 重复",
    stdout: "zh f",
  },
  {
    command: "pinyin -p _ 重心",
    stdout: "zhòng_xīn",
  },
  {
    command: "pinyin -p '*' -s INITIALS 重复",
    stdout: "zh*f",
  },
  {
    command: "pinyin -p '' -s normal 重复",
    stdout: "zhongfu",
  },

];

describe("cli: command line interface.", function() {

  testcases.forEach(function(testcase) {

    it("$ " + testcase.command, function(done) {
      child_process.exec("bin/" + testcase.command, function(err, stdout) {
        expect(err).to.eql(null);
        expect(stdout).to.eql(testcase.stdout + "\n");
        done();
      });
    });

  });

});
